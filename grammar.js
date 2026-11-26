/**
 * Tree-sitter grammar for .super files: the TSX grammar, plus statements written between tags
 * (see packages/lang/SPEC.md in the Super repository) and the adapted scanner in src/scanner.h.
 */
const TSX = require('tree-sitter-typescript/tsx/grammar');

module.exports = grammar(TSX, {
  name: 'super',

  rules: {
    // Between tags: statements too.
    _jsx_child: ($, previous) =>
      choice(previous, $.jsx_if_statement, $.jsx_for_statement, $.jsx_switch_statement, $.jsx_declaration, $.jsx_slot),

    // A named slot of a component: `<:footer>…</:footer>`.
    jsx_slot: ($) =>
      seq('<', ':', field('name', $.identifier), '>', repeat($._jsx_child), '<', '/', ':', field('close_name', $.identifier), '>'),

    // The body of a statement: children, like those of an element.
    jsx_block: ($) => seq('{', repeat($._jsx_child), '}'),

    jsx_if_statement: ($) =>
      prec.right(
        seq(
          'if',
          field('condition', $.parenthesized_expression),
          field('consequence', $.jsx_block),
          optional(seq('else', field('alternative', choice($.jsx_if_statement, $.jsx_block)))),
        ),
      ),

    // `for (const x of xs; key x.id) { … }`
    jsx_for_statement: ($) =>
      seq(
        'for',
        '(',
        field('kind', choice('const', 'let')),
        field('left', choice($.identifier, $._destructuring_pattern)),
        'of',
        field('right', $.expression),
        optional(seq(';', 'key', field('key', $.expression))),
        ')',
        field('body', $.jsx_block),
      ),

    // Each `case` stops at the next one: no fall-through, `break;` is optional.
    jsx_switch_statement: ($) =>
      seq('switch', field('value', $.parenthesized_expression), '{', repeat(choice($.jsx_switch_case, $.jsx_switch_default)), '}'),
    jsx_switch_case: ($) => prec.right(seq('case', field('value', $.expression), ':', repeat($._jsx_child), optional(seq('break', ';')))),
    jsx_switch_default: ($) => prec.right(seq('default', ':', repeat($._jsx_child), optional(seq('break', ';')))),

    // `const { product } = line;`
    jsx_declaration: ($) => $.lexical_declaration,

    // In a class body: `@tag = 'confirm-dialog';` and `@title = 'Confirmation';` (`@prop name: Type;`
    // and `@emit name: Type;` are decorated fields, plain TypeScript).
    class_body: ($, previous) => {
      const body = previous.members[1];
      return seq('{', repeat(choice($.super_declaration, ...body.content.members)), '}');
    },
    super_declaration: ($) =>
      seq('@', field('name', alias(choice('tag', 'title'), $.identifier)), '=', field('value', $.expression), $._semicolon),
  },
});

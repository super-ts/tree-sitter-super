/**
 * Grammaire Tree-sitter des fichiers .super : celle de TSX, plus les instructions écrites entre les
 * balises (voir packages/lang/SPEC.md) et le scanner adapté de src/scanner.h.
 */
const TSX = require('tree-sitter-typescript/tsx/grammar');

module.exports = grammar(TSX, {
  name: 'super',

  rules: {
    // Entre les balises : aussi des instructions.
    _jsx_child: ($, previous) =>
      choice(previous, $.jsx_if_statement, $.jsx_for_statement, $.jsx_switch_statement, $.jsx_declaration, $.jsx_slot),

    // Un emplacement nommé d'un composant : `<:footer>…</:footer>`.
    jsx_slot: ($) =>
      seq('<', ':', field('name', $.identifier), '>', repeat($._jsx_child), '<', '/', ':', field('close_name', $.identifier), '>'),

    // Le corps d'une instruction : des enfants, comme ceux d'un élément.
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

    // Chaque `case` s'arrête au suivant : pas de cascade, `break;` facultatif.
    jsx_switch_statement: ($) =>
      seq('switch', field('value', $.parenthesized_expression), '{', repeat(choice($.jsx_switch_case, $.jsx_switch_default)), '}'),
    jsx_switch_case: ($) => prec.right(seq('case', field('value', $.expression), ':', repeat($._jsx_child), optional(seq('break', ';')))),
    jsx_switch_default: ($) => prec.right(seq('default', ':', repeat($._jsx_child), optional(seq('break', ';')))),

    // `const { product } = line;`
    jsx_declaration: ($) => $.lexical_declaration,

    // Dans le corps d'une classe : `@tag = 'confirm-dialog';` et `@title = 'Confirmation';` (les
    // `@prop nom: Type;` et `@emit nom: Type;` sont des champs décorés, du TS ordinaire).
    class_body: ($, previous) => {
      const body = previous.members[1];
      return seq('{', repeat(choice($.super_declaration, ...body.content.members)), '}');
    },
    super_declaration: ($) =>
      seq('@', field('name', alias(choice('tag', 'title'), $.identifier)), '=', field('value', $.expression), $._semicolon),
  },
});

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.svg" />
    <img src="assets/logo-light.svg" alt="Super." width="140" />
  </picture>
</p>

# tree-sitter-super

Tree-sitter grammar for the `.super` files of the [Super](https://github.com/super-ts/super) framework.
It is the TSX grammar (`zed-industries/tree-sitter-typescript`), plus the statements written between
tags (`if`, `for … ; key`, `switch`, declarations, named slots `<:name>`), the `@tag` and `@title`
declarations of a component body, and an adapted external scanner (`src/scanner.h`):

- text between tags stops before a reserved form at the start of a child, like the `.super` parser
  of the Super compiler (`packages/lang/src/parser.ts`);
- an automatic semicolon is inserted before a `<` followed by a letter at the start of a line: two
  elements on two lines are two statements, not a comparison.

```sh
npm install
npm run generate   # regenerates src/parser.c
npm run check      # parses every .super file of the Super repository, expecting no ERROR node
```

`npm run check` reads the `.super` files of the Super repository, in which this grammar is mounted as
a submodule (`editors/tree-sitter-super`).

The Zed extension of Super builds the grammar from this git repository, at the revision set in
`editors/zed/extension.toml`: after a change, commit here, then update `rev` there.

## Releases

Versions follow the [Conventional Commits](https://www.conventionalcommits.org/) on `main`:
[release-please](https://github.com/googleapis/release-please) keeps a release pull request open,
with the next version in `package.json` and `tree-sitter.json` and the new `CHANGELOG.md` entries.
Merging it creates the `vX.Y.Z` tag and the GitHub release. Before 1.0, `feat` bumps the minor
version and `fix` the patch version; a breaking change bumps the minor version.

## Licence

[MIT](LICENSE)

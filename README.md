# tree-sitter-super

Grammaire Tree-sitter des fichiers `.super` du framework Super : celle de TSX
(`zed-industries/tree-sitter-typescript`), plus les instructions écrites entre les balises (`if`,
`for … ; key`, `switch`, déclarations) et un scanner adapté (`src/scanner.h`) :

- le texte entre balises s'arrête devant une forme réservée en début d'enfant, comme le parser des
  `.super` (`packages/lang/src/parser.ts`) ;
- un point-virgule automatique est inséré avant un `<` suivi d'une lettre en début de ligne : deux
  éléments sur deux lignes sont deux instructions, pas une comparaison.

```sh
npm install
npm run generate                                     # régénère src/parser.c
npm run check                                        # chaque .super du dépôt, sans nœud ERROR attendu
```

Zed compile la grammaire depuis ce dépôt git, à la révision donnée dans `editors/zed/extension.toml` :
après une modification, commiter ici puis mettre à jour `rev`.

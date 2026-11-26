// Scanner externe de la grammaire .super : celui de TSX (tree-sitter-typescript), adapté dans
// scanner.h (texte entre balises, point-virgule automatique avant un élément).
#include "scanner.h"

void *tree_sitter_super_external_scanner_create() { return NULL; }

void tree_sitter_super_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_super_external_scanner_serialize(void *payload, char *buffer) { return 0; }

void tree_sitter_super_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {}

bool tree_sitter_super_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
    return external_scanner_scan(payload, lexer, valid_symbols);
}

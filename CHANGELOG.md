# Changelog

## 0.1.0 (2026-11-26)

### Features

* Tree-sitter grammar for `.super` files, extending the TSX grammar
* Statements between tags: `if` / `else`, `for … of …; key …`, `switch` with `case` and `default`, declarations
* Named slots `<:name>…</:name>`
* `@tag` and `@title` declarations in component bodies
* External scanner: text stops before a reserved form, and an automatic semicolon separates two elements on two lines

import { Keyword, Token } from "./types";

export default class Tokenizor {
  constructor(private readonly code: string) {}

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    let pos = 0;

    while (pos < this.code.length) {
      const char = this.code[pos];

      // Ignore whitespace and newlines
      if (char === " " || char === "\n" || char === "\r") {
        pos++;
      }

      // start of a string
      else if (char === '"') {
        let _char = this.code[++pos];
        let value = "";

        while (
          pos < this.code.length &&
          _char !== '"' &&
          _char !== "\n" &&
          _char !== "\r"
        ) {
          value += _char;
          _char = this.code[++pos];
        }

        if (_char !== '"') {
          throw new Error(`Expected a closing " but got ${_char}`);
        }

        tokens.push({
          type: "string",
          value,
        });
        pos++;
      }

      // keywords
      else {
        let _char = char;
        let value = "";

        while (
          pos < this.code.length &&
          _char !== " " &&
          _char !== "\n" &&
          _char !== "\r"
        ) {
          value += _char;
          _char = this.code[++pos];
        }

        tokens.push({
          type: "keyword",
          value: value as Keyword,
        });
        pos++;
      }
    }

    return tokens;
  }
}

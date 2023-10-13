const keywords = ["say"] as const;

type Token =
  | {
      type: "keyword";
      value: (typeof keywords)[number];
    }
  | {
      type: "string";
      value: string;
    };

export class LoveLanguage {
  constructor(private readonly code: string) {}

  run() {
    try {
      const tokens = this.tokenize();
      this.parse(tokens);
    } catch (error) {
      console.error(error);
    }
  }

  private tokenize(): Token[] {
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
          value: value as (typeof keywords)[number],
        });
        pos++;
      }
    }

    return tokens;
  }

  private parse(tokens: Token[]) {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === "keyword") {
        if (token.value === "say") {
          const nextToken = tokens[++i];
          if (nextToken.type === "string") {
            console.log(nextToken.value);
          } else {
            throw new Error(`Expected a string but got ${nextToken.value}`);
          }
        } else {
          throw new Error(`Invalid keyword ${(token as any).value}`);
        }
      } else {
        throw new Error(`Unexpected token ${token.value}`);
      }
    }
  }
}

import { Keyword, Token } from "./types";

const DEFAULT_WORD_TERMINATORS = ["\n", "\r"] as const;

export default class Tokenizor {
  /**
   * Keep track of the current position in the code. This should be reset to 0 every time
   * we tokenize a new code.
   */
  private pos = 0;

  /**
   * Keep track of the tokens we've tokenized so far. This should be reset to an empty array
   * every time we tokenize a new code.
   */
  private tokens: Token[] = [];

  constructor(private readonly code: string) {}

  /**
   * Get the current character in the code. This is just a shorthand for `this.code[this.pos]`.
   */
  private get char() {
    return this.code[this.pos];
  }

  /**
   * Move to the next character in the code. This is just a shorthand for `this.pos++`
   */
  private move() {
    this.pos++;
  }

  /**
   * Get a word from the code. This will keep moving forward from current position (`pos`)
   * until it reaches a character that is in the `terminators` or `DEFAULT_WORD_TERMINATORS`, or
   * the end of the code. Please note that this function modifies the `pos` variable.
   * @param terminators A list of characters that will stop the string from being read.
   * @returns The string that was read.
   */
  private readWord(...terminators: string[]): string {
    let word = "";

    while (
      this.pos < this.code.length &&
      !terminators.includes(this.char) &&
      !DEFAULT_WORD_TERMINATORS.includes(this.char as any)
    ) {
      word += this.char;
      this.move();
    }

    return word;
  }

  private addToken(token: Token) {
    this.tokens.push(token);
  }

  /**
   * Tokenize the code.
   */
  public tokenize(): Token[] {
    // reset the tokens and pos
    this.tokens = [];
    this.pos = 0;

    while (this.pos < this.code.length) {
      // Ignore whitespace and newlines
      if (this.char === " " || this.char === "\n" || this.char === "\r") {
        this.pos++;
      }

      // start of a string
      else if (this.char === '"') {
        let word = this.readWord('"');

        // first character after the above read string should be a "
        if (this.char !== '"') {
          throw new Error(`Expected a closing " but got ${this.char}`);
        }

        this.addToken({ type: "string", value: word });
        this.move();
      }

      // everything else if considered as keywords
      else {
        const word = this.readWord(" ");
        this.addToken({ type: "keyword", value: word as Keyword });
        this.move();
      }
    }

    return this.tokens;
  }
}

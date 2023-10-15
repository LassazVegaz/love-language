import os from "os";
import { Keyword, Token } from "./types";
import { EOL } from "./constants";

const DEFAULT_WORD_TERMINATORS = [os.EOL] as const;

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
   * Check if the current character is the end of the line.
   */
  private isEndOfLine() {
    let t = "";
    for (let i = 0; i < os.EOL.length; i++) {
      t += this.code[this.pos + i];
    }
    return t === os.EOL;
  }

  /**
   * Move to the end of the line. This will move the `pos` variable to the end of the line.
   */
  private moveToEndOfLine() {
    for (let i = 0; i < os.EOL.length; i++) this.move();
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
      !this.isEndOfLine()
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
      // Ignore whitespace
      if (this.char === " ") {
        this.pos++;
      }

      // new line character
      else if (this.isEndOfLine()) {
        this.addToken({ type: "keyword", value: "EOL" });
        this.moveToEndOfLine();
      }

      // start of a string
      else if (this.char === '"') {
        this.move();
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
      }
    }

    // if last token is not EOL, add it
    if (
      this.tokens.length > 0 &&
      this.tokens[this.tokens.length - 1].value !== EOL
    ) {
      this.addToken({ type: "keyword", value: "EOL" });
    }

    return this.tokens;
  }
}

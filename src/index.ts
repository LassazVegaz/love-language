import Tokenizor from "./tokenizer";
import { Token } from "./types";

export class LoveLanguage {
  constructor(private readonly code: string) {}

  run() {
    try {
      const tokenizer = new Tokenizor(this.code);
      const tokens = tokenizer.tokenize();
      this.parse(tokens);
    } catch (error) {
      console.error(error);
    }
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

import { Token } from "./types";

export default class Passer {
  private passed = false;

  constructor(private readonly tokens: Token[]) {}

  private passHelper() {
    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i];
      if (token.type === "keyword") {
        if (token.value === "say") {
          const nextToken = this.tokens[++i];
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

  public pass() {
    if (this.passed) {
      throw new Error("Cannot pass twice");
    }

    try {
      this.passHelper();
    } catch (error) {
      this.passed = true;
      throw error;
    }
  }
}

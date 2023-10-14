import { Token } from "./types";
import { VARIABLE_TYPES } from "./constants";

export default class Passer {
  private passed = false;
  private pos = 0;
  private variables: Record<string, any> = {};

  constructor(private readonly tokens: Token[]) {}

  private get token() {
    return this.tokens[this.pos];
  }

  private move() {
    this.pos++;
  }

  /**
   * Execute say function for current token. This will throw an error if the current token is not a
   * string.
   */
  private say() {
    if (this.token.type === "string") {
      console.log(this.token.value);
    } else if (this.variables[this.token.value]) {
      console.log(this.variables[this.token.value]);
    } else {
      throw new Error(`Variable ${this.token.value} is not defined`);
    }
  }

  /**
   * Save a variable. This will throw an error if the current token is not a variable name or if the
   * next tokens are not "as a" followed by a variable type and a value.
   */
  private saveVariable() {
    // get variable name
    if (this.token.type !== "keyword")
      throw new Error(`Expected a variable name but got ${this.token.value}`);
    const variableName = this.token.value;
    this.move();

    // next one should be "as"
    if (this.token.type !== "keyword" || this.token.value !== "as")
      throw new Error(`Expected "as" but got ${this.token.value}`);
    this.move();

    // next one should be "a"
    if (this.token.type !== "keyword" || this.tokens[this.pos].value !== "a")
      throw new Error(`Expected "a" but got ${this.token.value}`);
    this.move();

    // next one should be a variable type
    if (this.token.type !== "keyword")
      throw new Error(
        `Expected a variable type but got ${this.tokens[this.pos].value}`
      );
    const variableType = this.token.value;
    if (!VARIABLE_TYPES.includes(variableType as any))
      throw new Error(`Invalid variable type ${variableType}`);
    this.move();

    // next one should be the value
    const variableValue = this.tokens[this.pos].value;

    // save the variable
    this.variables[variableName] = variableValue;
  }

  /**
   * Clean the memory. This will remove all the variables.
   */
  private cleanMemory() {
    this.variables = {};
  }

  /**
   * Pass the tokens.
   */
  public pass() {
    if (this.passed) {
      throw new Error("Cannot pass twice");
    }
    this.passed = true;

    while (this.pos < this.tokens.length) {
      if (this.token.type === "keyword") {
        if (this.token.value === "say") {
          this.move();
          this.say();
        } else if (this.token.value === "love") {
          this.move();
          this.saveVariable();
        } else {
          throw new Error(`Invalid keyword ${(this.token as any).value}`);
        }
      } else {
        throw new Error(`Unexpected token ${this.token.value}`);
      }

      this.move();
    }

    this.cleanMemory();
  }
}

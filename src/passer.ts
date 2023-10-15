import { Token } from "./types";
import { VARIABLE_TYPES, DEFAULT_VARIABLES_VALUES } from "./constants";

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
   * Execute say function.
   *
   * Print from current token to end of the line token. This will throw an error if any of the
   * tokens is not a string, number or a defined variable. This will move `pos` to the end of the
   * line.
   */
  private say() {
    while (this.token.type !== "keyword" || this.token.value !== "EOL") {
      if (this.token.type === "string") {
        console.log(this.token.value);
      } else if (this.variables[this.token.value]) {
        console.log(this.variables[this.token.value]);
      } else {
        throw new Error(`Variable ${this.token.value} is not defined`);
      }

      this.move();
    }
  }

  /**
   * Save a variable. This will throw an error if the current token is not a variable name or if
   * the next tokens are not "as a", variable type and EOL. This will move `pos` to the end of the line.
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
    const variableType = this.tokens[this.pos].value;
    if (!VARIABLE_TYPES.includes(variableType as any))
      throw new Error(`Invalid variable type ${variableType}`);

    // get default value
    const variableValue = (DEFAULT_VARIABLES_VALUES as any)[variableType];

    // save the variable
    this.variables[variableName] = variableValue;

    // move to EOL
    this.move();
    if (this.token.type !== "keyword" || this.tokens[this.pos].value !== "EOL")
      throw new Error(`Expected end of line but got ${this.token.value}`);
  }

  private changeVariableValue() {
    // get variable name
    if (this.token.type !== "keyword")
      throw new Error(`Expected a variable name but got ${this.token.value}`);
    const variableName = this.token.value;
    if (!(variableName in this.variables))
      throw new Error(`Variable ${variableName} is not defined`);
    this.move();

    // next one should be "is"
    if (this.token.type !== "keyword" || this.token.value !== "is")
      throw new Error(`Expected "is" but got ${this.token.value}`);
    this.move();

    // next one should be a value
    if (this.tokens[this.pos].type !== "string")
      throw new Error(
        `Expected a value but got ${this.tokens[this.pos].value}`
      );
    const variableValue = this.tokens[this.pos].value;

    // save the variable
    this.variables[variableName] = variableValue;

    // move to EOL
    this.move();
    if (this.token.type !== "keyword" || this.tokens[this.pos].value !== "EOL")
      throw new Error(`Expected end of line but got ${this.token.value}`);
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
        // say function
        if (this.token.value === "say") {
          this.move();
          this.say();
        }

        // variable declaration
        else if (this.token.value === "love") {
          this.move();
          this.saveVariable();
        }

        // change variable value
        else if (this.token.value in this.variables) {
          this.changeVariableValue();
        }

        // nothing matched
        else {
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

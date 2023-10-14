import Passer from "./passer";
import Tokenizor from "./tokenizer";
export class LoveLanguage {
  constructor(private readonly code: string) {}

  run() {
    try {
      const tokenizer = new Tokenizor(this.code);
      const tokens = tokenizer.tokenize();

      const passer = new Passer(tokens);
      passer.pass();
    } catch (error) {
      console.error(error);
    }
  }
}

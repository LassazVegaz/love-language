import fs from "fs";
import path from "path";
import { LoveLanguage } from "../src";

const code = fs.readFileSync(path.join(__dirname, "test.love"), "utf8");
const interpreter = new LoveLanguage(code);
interpreter.run();

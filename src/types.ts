import { KEYWORDS } from "./constants";

export type Keyword = (typeof KEYWORDS)[number];

export type Token =
  | {
      type: "keyword";
      value: Keyword;
    }
  | {
      type: "string";
      value: string;
    };

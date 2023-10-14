import { keywords } from "./constants";

export type Keyword = (typeof keywords)[number];

export type Token =
  | {
      type: "keyword";
      value: Keyword;
    }
  | {
      type: "string";
      value: string;
    };

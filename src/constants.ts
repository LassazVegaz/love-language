// EOL is end of line. This is used instead of \n or \r\n because it they can be different on
// different operating systems. Here I just want to identify the end of a line. When the tokenizer
// finds \n or \r\n, it will replace them with EOL.
export const EOL = "EOL" as const;

export const KEYWORDS = ["say", "love", "as", "a", EOL] as const;

export const VARIABLE_TYPES = ["string", "number"] as const;

// default values
export const DEFAULT_VARIABLES_VALUES = {
  number: 0,
  string: null,
} as const;

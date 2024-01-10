class PasswordComponents {
  constructor() {
    this.numbers = [...Array(10)].map((_, index) => index.toString()); // 0 - 9
    this.lowercases = [...Array(26)].map((_, index) => String.fromCharCode(97 + index)); // a - z
    this.uppercases = [...Array(26)].map((_, index) => String.fromCharCode(65 + index)); // A - Z
    this.symbols = [
      "`",
      "~",
      "!",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      "-",
      "+",
      "[",
      "]",
      "{",
      "}",
      "\\",
      "|",
      ";",
      ":",
      "'",
      '"',
      ",",
      "<",
      ".",
      ">",
      "/",
      "?",
    ];

    // characters that could be filtered out if the user wants
    this.similarChars = ["i", "l", "1", "I", "!", "|", "o", "0", "O", ";", ":"];
    this.ambiguousChars = ["[", "]", "{", "}", "(", ")", "<", ">", ";", ":", "'", '"'];
  }

  getComponent(component) {
    if (component === "numbers") {
      return this.numbers;
    } else if (component === "lowercases") {
      return this.lowercases;
    } else if (component === "uppercases") {
      return this.uppercases;
    } else if (component === "symbols") {
      return this.symbols;
    } else {
      return -1;
    }
  }

  getFilter(filter) {
    if (filter === "similar") {
      return this.similarChars;
    } else if (filter === "ambiguous") {
      return this.ambiguousChars;
    } else {
      return -1;
    }
  }
}

const PwdComponents = new PasswordComponents();

export { PwdComponents };

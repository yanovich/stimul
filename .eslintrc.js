module.exports = {
    "extends": "airbnb",
    "rules": {
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "*", "next": "return" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*"},
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"]}
      ],
      "max-len": ["error", 140],
      "linebreak-style": [
        "error",
        "unix"
      ],
      "func-names": ["off"]
    }
  };
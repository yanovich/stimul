module.exports = {
  "env": {
      "browser": true,
      "commonjs": true,
      "es6": true
  },
  "extends": "eslint:recommended",
  "parser": "babel-eslint",
  "parserOptions": {
      "ecmaFeatures": {
          "experimentalObjectRestSpread": true,
          "jsx": true,
          "modules": true,
      },
      "sourceType": "module"
  },
  "plugins": [
      "react"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "rules": {
      "indent": [
          "error",
          2
      ],
      "linebreak-style":0,
      "max-len": ["warn", 200],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "react/no-deprecated": ["off"],
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "*", "next": "return" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*"},
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"]}
      ],
  }
};
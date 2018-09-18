module.exports = {
  "env": {
      "browser": true,
      "commonjs": true,
      "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
      "ecmaFeatures": {
          "experimentalObjectRestSpread": true,
          "jsx": true
      },
      "sourceType": "module"
  },
  "plugins": [
      "react"
  ],
  "rules": {
      "indent": [
          "error",
          2
      ],
      "linebreak-style":0,
      "no-console": ["error", { allow: ["warn", "error"] }],
      "react/no-deprecated": ["off"]
  }
};
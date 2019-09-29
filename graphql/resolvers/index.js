/* graphql/resolvers/index.js -- resolvers setup
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

let root = {
  hello: () => {
    return "Hello world!";
  }
};

require("./sites")(root);
require("./users")(root);
require("./sessions")(root);
require("./regions")(root);
require("./indicators")(root);
require("./values")(root);
require("./correllations")(root);

module.exports = root;

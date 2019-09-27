/* test/populate/indicators.js -- populate indicators collection
 * Copyright 2019 Sergei Ianovich
 *
 * Contributors:
 * Sergei Ianovich <s@asutp.io>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const Indicator = require("../../graphql/models/indicator");
const queries = {};
require("../../graphql/resolvers/indicators")(queries);
const indicators = require("./indicators.json");

let populated = false;

module.exports = async done => {
  if (populated) {
    return done();
  }

  await Indicator.find().deleteMany();
  for (let i = 0; i < indicators.length; i++) {
    await queries.newIndicator({ indicator: indicators[i] });
  }

  populated = true;
  done();
};

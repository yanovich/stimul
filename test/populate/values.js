/* test/populate/indicators.js -- populate indicators collection
 * Copyright 2019 Sergei Ianovich
 *
 * Contributors:
 * Sergei Ianovich <s@asutp.io>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const Value = require("../../graphql/models/value");
const queries = {};
require("../../graphql/resolvers/values")(queries);
const values = require("./values.json");
const regions = require("./regions.json");

let populated = false;

module.exports = async done => {
  if (populated) {
    return done();
  }

  await Value.find().deleteMany();
  for (let i = 0; i < values.length; i++) {
    let value = values[i];

    value.indicatorId = "55376";
    let region = regions.find(r => r.statName === value.statName);
    console.log(value.statName);

    value.osmId = regions.find(r => r.statName === value.statName).osmId;

    delete value.statName;
    // console.log(value);

    await queries.newValue({ value });
  }

  populated = true;
  done();
};

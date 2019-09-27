/* test/populate/sites.js -- populate sites collection
 * Copyright 2019 Sergei Ianovich
 *
 * Contributors:
 * Sergei Ianovich <s@asutp.io>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const Region = require("../../graphql/models/region");
const queries = {};
require("../../graphql/resolvers/regions")(queries);
const regions = require("./regions.json");

let populated = false;

module.exports = async done => {
  if (populated) {
    return done();
  }

  await Region.find().deleteMany();
  for (let i = 0; i < regions.length; i++) {
    await queries.newRegion({ region: regions[i] });
  }

  populated = true;
  done();
};

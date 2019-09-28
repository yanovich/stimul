/* test/populate/sites.js -- populate sites collection
 * Copyright 2019 Sergei Ianovich
 *
 * Contributors:
 * Sergei Ianovich <s@asutp.io>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const Site = require("../../graphql/models/site");
const queries = {};
require("../../graphql/resolvers/sites")(queries);

let populated = false;

const sites = require("./sites.json");

module.exports = async done => {
  if (populated) {
    return done();
  }

  await Site.find().deleteMany();
  for (let i = 0; i < sites.length; i++) {
    await queries.newSite({ site: sites[i] });
  }

  populated = true;
  done();
};

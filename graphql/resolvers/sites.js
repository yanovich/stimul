/* graphql/resolvers/sites.js -- site collection resolvers
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const Site = require("../models/site");
const { getUser } = require("../utils/auth");

function injectSites(root) {
  if (root.sites !== undefined) {
    throw Error("sites resolver already defined");
  }

  root.sites = ({ at }, req) => {
    let query = {};
    if (at) query.year = { $lte: at };
    return Site.find(query);
  };

  root.site = ({ name }, req) => {
    const user = getUser(req);

    if (!user) {
      return null;
    }
    return Site.findOne({ name });
  };

  root.newSite = async (data, req) => {
    const { name, latlng, year, address, osmId } = data.site;
    const site = new Site({ name, latlng, year, address, osmId });
    await site.save();
    return site;
  };
}

module.exports = injectSites;

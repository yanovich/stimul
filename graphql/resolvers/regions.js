/* graphql/resolvers/sites.js -- site collection resolvers
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const Region = require("../models/region");

function injectRegions(root) {
  if (root.regions !== undefined) {
    throw Error("regions resolver already defined");
  }

  root.regions = (date, req) => {
    return Region.find();
  };

  root.region = ({ statName, osmId }, req) => {
    let query = {};
    if (statName) query.statName = statName;
    if (osmId) query.osmId = osmId;
    return Region.findOne(query);
  };

  root.newRegion = async (data, req) => {
    const { osmId, statName, level } = data.region;
    const region = new Region({ osmId, statName, level });
    await region.save();
    return region;
  };
}

module.exports = injectRegions;

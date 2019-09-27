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

  root.region = ({ name }, req) => {
    return Region.findOne({ name });
  };

  root.newRegion = async (data, req) => {
    const { osmId, statName } = data.region;
    const region = new Region({ osmId, statName });
    await region.save();
    return region;
  };
}

module.exports = injectRegions;

/* graphql/resolvers/sites.js -- site collection resolvers
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const Value = require("../models/value");

function injectValues(root) {
  if (root.values !== undefined) {
    throw Error("values resolver already defined");
  }

  root.values = ({ indicatorId, osmId, year }, req) => {
    let query = { indicatorId };
    if (Array.isArray(osmId)) query.osmId = osmId;
    if (Array.isArray(year)) query.year = year;
    let values = Value.find(query);
    return values;
  };

  root.newValue = async (data, req) => {
    const { indicatorId, osmId, year, value } = data.value;
    const indicator = new Value({ indicatorId, osmId, year, value });
    await indicator.save();
    return indicator;
  };
}

module.exports = injectValues;

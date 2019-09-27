/* graphql/resolvers/sites.js -- site collection resolvers
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const Indicator = require("../models/indicator");

function injectIndicators(root) {
  if (root.indicators !== undefined) {
    throw Error("indicators resolver already defined");
  }

  root.indicators = (date, req) => {
    return Indicator.find();
  };

  root.indicator = ({ name }, req) => {
    return Indicator.findOne({ name });
  };

  root.newIndicator = async (data, req) => {
    const { id, name } = data.indicator;
    const indicator = new Indicator({ id, name });
    await indicator.save();
    return indicator;
  };
}

module.exports = injectIndicators;

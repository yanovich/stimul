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
const Value = require("../models/value");
const Region = require("../models/region");
const Site = require("../models/site");

function correlation(values) {
  const l = values.length;
  const { sumX, sumY } = values.reduce(
    (acc, cur, index) => {
      return {
        sumX: acc.sumX + cur.targetCount,
        sumY: acc.sumY + cur.value
      };
    },
    { sumX: 0, sumY: 0 }
  );
  const avgX = sumX / l;
  const avgY = sumY / l;
  const { dxdy, dx2, dy2 } = values.reduce(
    (acc, cur, index) => {
      return {
        dxdy: acc.dxdy + (cur.targetCount - avgX) * (cur.value - avgY),
        dx2: acc.dx2 + (cur.targetCount - avgX) ** 2,
        dy2: acc.dy2 + (cur.value - avgY) ** 2
      };
    },
    { dxdy: 0, dx2: 0, dy2: 0 }
  );

  const r = dxdy / Math.sqrt(dx2 * dy2);
  const m = (1 - r * r) / (l > 30 ? Math.sqrt(l) : Math.sqrt(l - 1));

  return { r, m };
}

function injectCorrellations(root) {
  if (root.correllations !== undefined) {
    throw Error("indicators resolver already defined");
  }

  root.correllations = async ({ indicatorId, osmId }, req) => {
    let query = {};
    if (Array.isArray(osmId)) query.osmId = osmId;

    let regions = await Region.find(query);
    const indicator = await Indicator.findOne({ id: indicatorId });

    let correllations = [];

    for (let region of regions) {
      let values = await Value.find({
        indicatorId,
        osmId: region.osmId
      }).lean();
      for (let v in values) {
        let sites = await Site.find({
          year: { $lte: values[v].year },
          osmId: region.osmId
        });
        values[v].targetCount = sites.length;
      }
      let c = correlation(values);
      c = { ...c, osmId: region.osmId, indicatorId, region, indicator };

      correllations.push(c);
    }

    return correllations;
  };
}

module.exports = injectCorrellations;

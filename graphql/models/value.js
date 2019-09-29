/* graphql/models/sites.js -- Site model
 * Copyright 2019 Sergei Ianovich
 *
 * Contributors:
 * Sergei Ianovich <s@asutp.io>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const mongoose = require("mongoose");
const Region = require("./region");
const Indicator = require("./indicator");
const Site = require("./site");

const valueSchema = new mongoose.Schema({
  indicatorId: {
    type: String,
    required: true
  },
  osmId: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
});

valueSchema.virtual("region").get(async function() {
  return await Region.findOne({ osmId: this.osmId });
});

valueSchema.virtual("indicator").get(async function() {
  return await Indicator.findOne({ id: this.indicatorId });
});

valueSchema.virtual("targetCount").get(async function() {
  let sites = await Site.find({
    year: { $lte: this.year },
    osmId: this.osmId
  });

  return sites.length;
});

valueSchema.virtual("baseValue").get(async function() {
  const indicator = await Indicator.findOne({ id: this.indicatorId });
  if (!indicator || !indicator.baseIndicatorId) return null;
  const baseValue = await module.exports.findOne({
    indicatorId: indicator.baseIndicatorId,
    osmId: this.osmId,
    year: this.year
  });

  return baseValue;
});

valueSchema.virtual("rate").get(async function() {
  const indicator = await Indicator.findOne({ id: this.indicatorId });
  if (!indicator || !indicator.baseIndicatorId) return null;
  const baseValue = await module.exports.findOne({
    indicatorId: indicator.baseIndicatorId,
    osmId: this.osmId,
    year: this.year
  });
  if (!baseValue) return null;
  if (baseValue.value === 0) return NaN;
  return this.value / baseValue.value;
});

valueSchema.index({ indicatorId: 1, osmId: 1, year: 1 });

module.exports = mongoose.model("Value", valueSchema);

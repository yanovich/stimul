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

const indicatorSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  isPositive: {
    type: Boolean,
    required: true
  },
  baseIndicatorId: {
    type: String,
    required: false
  }
});

indicatorSchema.virtual("baseIndicator").get(async function() {
  return await module.exports.findOne({ id: this.baseIndicatorId });
});

indicatorSchema.index({ id: 1 });

module.exports = mongoose.model("Indicator", indicatorSchema);

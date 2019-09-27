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

const regionSchema = new mongoose.Schema({
  osmId: {
    type: String,
    required: true,
    unique: true
  },
  statName: {
    type: String,
    required: true
  }
});

regionSchema.index({ osmId: 1 });

module.exports = mongoose.model("Region", regionSchema);

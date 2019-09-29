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

const siteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  location: mongoose.Schema.Types.Mixed,
  address: {
    type: String,
    required: true
  },
  year: {
    type: Number
  },
  osmId: {
    type: String,
    required: true
  }
});

siteSchema.virtual("latlng").get(function() {
  return [this.location.coordinates[1], this.location.coordinates[0]];
});

siteSchema.virtual("latlng").set(function(latlng) {
  this.location = {
    type: "Point",
    coordinates: [latlng[1], latlng[0]]
  };
});

siteSchema.virtual("region").get(async function() {
  return await Region.findOne({ osmId: this.osmId });
});

siteSchema.index({ name: 1 });

module.exports = mongoose.model("Site", siteSchema);

/* graphql/models/sites.js -- Site model
 * Copyright 2019 Sergei Ianovich
 *
 * Contributors:
 * Sergei Ianovich <s@asutp.io>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const mongoose = require('mongoose')

const siteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  location: mongoose.Schema.Types.Mixed
})

siteSchema.virtual('latlng').get((val, v, doc) => {
  return [doc.location.coordinates[1], doc.location.coordinates[0]]
})

siteSchema.virtual('latlng').set((latlng, v, doc) => {
  doc.location = {
    type: 'Point',
    coordinates: [latlng[1], latlng[0]]
  }
})

siteSchema.index({ name: 1 })

module.exports = mongoose.model('Site', siteSchema)

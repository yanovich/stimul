/* test/populate/sites.js -- populate sites collection
 * Copyright 2019 Sergei Ianovich
 *
 * Contributors:
 * Sergei Ianovich <s@asutp.io>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const Site = require('../../graphql/models/site')
const queries = {}
require('../../graphql/resolvers/sites')(queries)

let populated = false

const sites = [
  {
    name: 'Хорошёвка',
    latlng: [55.776975, 37.537188]
  },
  {
    name: 'Левобережка',
    latlng: [55.872715, 37.474561]
  },
  {
    name: 'Синявинская',
    latlng: [55.945084, 37.345524]
  },
  {
    name: 'Чкаловск',
    latlng: [54.769382, 20.414559]
  },
  {
    name: 'Оленегорск',
    latlng: [68.082598, 34.327618]
  },
  {
    name: 'Протоки',
    latlng: [68.109584, 33.925394]
  },
  {
    name: '60/МПК',
    latlng: [59.960467, 30.348203]
  },
  {
    name: 'Бычий',
    latlng: [59.977099, 30.228592]
  },
  {
    name: 'Питреское НВМУ',
    latlng: [59.955648, 30.332867]
  },
  {
    name: 'Адмиралтейство',
    latlng: [59.937991, 30.307734]
  }
]

module.exports = async done => {
  if (populated) {
    return done()
  }

  await Site.find().deleteMany()
  for (let i = 0; i < sites.length; i++) {
    queries.newSite({ site: sites[i] })
  }

  populated = true
  done()
}

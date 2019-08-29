/* graphql/resolvers/sites.js -- site collection resolvers
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const Site = require('../models/site')

function injectSites (root) {
  if (root.sites !== undefined) {
    throw Error('sites resolver already defined')
  }

  root.sites = () => {
    return Site.find()
  }

  root.newSite = async data => {
    const { name, latlng } = data.site
    const site = new Site({ name, latlng })
    await site.save()
    return site
  }
}

module.exports = injectSites

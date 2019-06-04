/* app.js -- application setup
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const webpack_dev_middleware = require('webpack-dev-middleware')
const webpack_hot_middleware = require('webpack-hot-middleware')
const express = require('express')

const config = require('./config/app')
const paths = require('./config/paths')

const app = express()


if (config.is_development) {
  const config = require('./config/webpack.config')('development')
  const compiler = webpack(config)
  app.use(webpack_dev_middleware(compiler, { color: true }))
  app.use(webpack_hot_middleware(compiler))
} else if (config.is_production) {
  if (!fs.existsSync(paths.appBuild + '/index.html')) {
    console.error('stimul: web app not present in production, exiting')
    process.exit(1)
  }
  app.use(express.static(path.join(__dirname, 'build/')))
}

app.listen(3000, () => console.info('stimul: listening on port 3000'))

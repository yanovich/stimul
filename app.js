/* app.js -- application setup
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const path = require('path')
const webpack = require('webpack')
const webpack_dev_middleware = require('webpack-dev-middleware')
const webpack_hot_middleware = require('webpack-hot-middleware')
const express = require('express')

const app = express()

if (process.env.NODE_ENV === 'development') {
  global.is_development = true
} else if (process.env.NODE_ENV === 'test') {
  global.is_test = true
} else {
  if (process.env.NODE_ENV !== 'production') {
    console.warn("stimul: running in 'production' mode by default")
    process.env.NODE_ENV = 'production'
  }
  global.is_production = true
}

if (global.is_development) {
  const config = require('./config/webpack.config')('development')
  const compiler = webpack(config)
  app.use(webpack_dev_middleware(compiler, { color: true }))
  app.use(webpack_hot_middleware(compiler))
} else if (global.is_production) {
  app.use(express.static(path.join(__dirname, 'build/')))
}

app.listen(3000, () => console.info('stimul: listening on port 3000'))

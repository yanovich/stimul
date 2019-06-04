/* app.js -- application setup
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

var path = require('path')
const webpack = require('webpack')
const w_dev_middleware = require('webpack-dev-middleware')
const w_hot_middleware = require('webpack-hot-middleware')
const express = require('express')

const app = express()

if (process.env.NODE_ENV === 'development') {
  const config = require('./config/webpack.config')('development')
  const compiler = webpack(config)
  app.use(w_dev_middleware(compiler, { color: true }))
  app.use(w_hot_middleware(compiler))
} else if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build/')))
} else {
  process.exit(1)
}

app.listen(3000, () => console.log('Example app listening on port 3000!'))

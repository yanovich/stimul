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
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const express = require('express')
const graphqlMiddleware = require('express-graphql')

const config = require('./config/app')
const paths = require('./config/paths')
const schema = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')

const app = express()

app.set('port', config.port)

if (config.isDevelopment) {
  const config = require('./config/webpack.config')('development')
  const compiler = webpack(config)
  compiler.hooks.invalid.tap('invalid', () => {
    console.log(new Date().toTimeString())
  })
  console.log(new Date().toTimeString())
  app.use(webpackDevMiddleware(compiler, {
    color: true,
    logLevel: 'warn'
  }))
  app.use(webpackHotMiddleware(compiler))
  app.use('/', express.static(path.join(__dirname, 'public')))
} else if (config.isProduction) {
  if (!fs.existsSync(paths.appBuild + '/index.html')) {
    console.error('stimul: web app not present in production, exiting')
    process.exit(1)
  }
  app.use(express.static(path.join(__dirname, 'build/')))
}

app.use(
  '/graphql',
  graphqlMiddleware({
    schema: schema,
    rootValue: resolvers,
    graphiql: config.isDevelopment
  })
)

module.exports = app

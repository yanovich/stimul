/* config/app.js -- application config
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

let config = {}

if (process.env.NODE_ENV === 'development') {
  config.isDevelopment = true
  config.port = 3000
  config.dbURL = 'mongodb://localhost:27017/stimul-test'
} else if (process.env.NODE_ENV === 'test') {
  config.isTest = true
  config.port = 0
  config.isProduction = true
  config.dbURL = 'mongodb://localhost:27017/stimul-test'
} else {
  if (process.env.NODE_ENV !== 'production') {
    console.warn("stimul: running in 'production' mode by default")
    process.env.NODE_ENV = 'production'
  }
  config.isProduction = true
  config.port = 3000
  config.dbURL = 'mongodb://localhost:27017/stimul'
}

module.exports = config

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
  config.is_development = true
} else if (process.env.NODE_ENV === 'test') {
  config.is_test = true
} else {
  if (process.env.NODE_ENV !== 'production') {
    console.warn("stimul: running in 'production' mode by default")
    process.env.NODE_ENV = 'production'
  }
  config.is_production = true
}

module.exports = config

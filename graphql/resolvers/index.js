/* graphql/resolvers/index.js -- resolvers setup
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const root = {
  hello: () => {
    return 'Hello world!'
  }
}

module.exports = root

/* graphql/schema/index.js -- schema setup
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const path = require('path')
const fs = require('fs')
const { buildSchema } = require('graphql')

const schema = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8')

module.exports = buildSchema(schema)

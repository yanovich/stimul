/* graphql/utils/auth.js -- authentication utilities
 * Copyright 2019 Sergei Ianovich
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const jwt = require('jsonwebtoken')

const APP_SECRET = 'APP_SECRET' // FIXME secret

function getUser (req) {
  const auth = req.get('Authorization')
  if (auth) {
    const token = auth.replace('Bearer ', '')
    const { email } = jwt.verify(token, APP_SECRET)
    return email
  }

  throw new Error('Not authenticated')
}

module.exports = {
  APP_SECRET,
  getUser
}

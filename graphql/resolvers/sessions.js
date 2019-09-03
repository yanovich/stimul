/* graphql/resolvers/sessions.js -- sessions resolvers
 * Copyright 2019 Sergei Ianovich
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { APP_SECRET } = require('../utils/auth')

function injectSessions (root) {
  if (root.login !== undefined) {
    throw new Error('sites resolver already defined')
  }

  root.login = async ({ email, password }) => {
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error('No such user found')
    }
    if (!(await user.authenticate(password))) {
      throw new Error('Invalid password')
    }

    const token = jwt.sign({ email }, APP_SECRET)
    return {
      token,
      user
    }
  }
}

module.exports = injectSessions

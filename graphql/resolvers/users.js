/* graphql/resolvers/users.js -- user collection resolvers
 * Copyright 2019 Sergei Ianovich
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const User = require('../models/user')

function injectUsers (root) {
  if (root.users !== undefined) {
    throw Error('users resolver already defined')
  }

  root.users = () => {
    return User.find()
  }

  root.newUser = async data => {
    const { email, password, confirmation } = data.user
    const user = new User({ email })
    await user.setPassword(password, confirmation)
    await user.save()
    return user
  }
}

module.exports = injectUsers

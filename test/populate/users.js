/* test/populate/users.js -- populate users collection
 * Copyright 2019 Sergei Ianovich
 *
 * Contributors:
 * Sergei Ianovich <s@asutp.io>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const User = require('../../graphql/models/user')
const queries = {}
require('../../graphql/resolvers/users')(queries)

let populated = false

const users = [
  {
    email: 'admin-1@example.com',
    password: '111111111',
    confirmation: '111111111'
  }
]

module.exports = async done => {
  if (populated) {
    return
  }

  await User.find().deleteMany()
  for (let i = 0; i < users.length; i++) {
    await queries.newUser({ user: users[i] })
  }

  populated = true
  done()
}

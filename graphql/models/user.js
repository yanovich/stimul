/* graphql/models/user.js -- User model
 * Copyright 2019 Sergei Ianovich
 *
 * Contributors:
 * Sergei Ianovich <s@asutp.io>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-z\d][\w+\-.]*@[a-z\d-]+(?:\.[a-z\d-]+)*\.[a-z]+$/i,
    trim: true
  },
  hash: {
    type: String,
    required: true
  }
})

userSchema.methods = {
  setPassword: function (password, confirmation) {
    return new Promise((resolve, reject) => {
      if (!password || password === '') {
        return resolve()
      }
      if (password !== confirmation) {
        this.invalidate('confirmation', {
          path: 'confirmation',
          type: 'mismatch'
        })
        return resolve()
      }
      bcrypt.hash(password, 1, (err, hash) => {
        // FIXME count
        if (err) {
          return reject(err)
        }
        this.hash = hash
        resolve()
      })
    })
  },

  authenticate: function (password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password || '', this.hash, (err, valid) => {
        if (err) {
          return reject(err)
        }
        return resolve(valid)
      })
    })
  }
}

userSchema.pre('save', function (next) {
  this.email = this.email.toLowerCase()
  next()
})

userSchema.index({ email: 1 })

module.exports = mongoose.model('User', userSchema)

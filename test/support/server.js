/* test/support/server.js -- start application for testing
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

process.env.NODE_ENV = 'test'

const http = require('http')
const mongoose = require('mongoose')
const app = require('../../app')
const server = http.createServer(app)
const puppeteer = require('puppeteer')

var port = app.get('port')

before(async () => {
  if (!port) {
    server.listen(app.get('port'))
    port = server.address().port
  }

  mongoose.set('useCreateIndex', true)
  mongoose.connect(app.get('dbURL'), { useNewUrlParser: true })

  global.url = 'http://localhost:' + port
  global.browser = await puppeteer.launch({
    devtools: false,
    headless: true,
    slowMo: 0,
    args: ['--no-sandbox']
  })
  global.wait = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))
})

after(async () => {
  server.close()
  mongoose.connection.close()
  await global.browser.close()
})

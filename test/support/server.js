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

var app = require('../../app')
var port = app.get('port')

if (!port) {
  var http = require('http')
  var server = http.createServer(app)
  server.listen(app.get('port'))
  port = server.address().port
}

global.url = 'http://localhost:' + port

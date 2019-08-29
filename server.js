/* server.js -- main application file
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const http = require('http')
const mongoose = require('mongoose')

const app = require('./app')

const server = http.createServer(app)

mongoose.set('useCreateIndex', true)

server.listen(app.get('port'), () => {
  const useNewUrlParser = true
  console.info('stimul: listening on port 3000')
  mongoose.connect(app.get('dbURL'), { useNewUrlParser })
})

server.on('close', () => {
  mongoose.connection.close()
})

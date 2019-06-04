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
const app = require('./app')

http.createServer(app).listen(app.get('port'), () => console.info('stimul: listening on port 3000'))

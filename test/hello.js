/* test/views/session.js -- test session pages, run it with mocha
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const expect = require('expect.js')
const Browser = require('zombie')

var browser

describe('Stimul', function () {
  beforeEach(function () {
    browser = new Browser({ site: global.url })
  })

  describe('default page', function () {
    beforeEach(function (done) {
      browser.visit('/').then(done, done)
    })

    it('should render', function () {
      expect(browser.statusCode).to.be(200)
      expect(browser.text('title')).to.contain('Стимул')
      browser.assert.element('#root')
      browser.assert.element('.stimul')
    })

    it('respond to a greeting', function (done) {
      browser.pressButton('Hello')
      browser.once('response', (req, res) => {
        res._stream.once('end', () => {
          // response.json() is async and needs some time
          setTimeout(() => {
            browser.assert.element('p', 'Hello World!')
            done()
          }, 5)
        })
      })
    })
  })
})

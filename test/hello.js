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

let page

describe('Stimul', function () {
  function logger (message) {
    console.log('client:', message.text())
  }

  beforeEach(async () => {
    page = await browser.newPage()
    page.on('console', logger)
  })

  afterEach(async () => {
    page.off('console', logger)
    await page.close()
  })

  describe('default page', function () {
    let response
    beforeEach(async () => {
      response = await page.goto(url)
    })

    it('should render', async function () {
      expect(response.status()).to.be(200)
      expect(await page.evaluate(() => document.title)).to.contain('Стимул')
      expect(await page.$('#root')).to.be.ok()
      expect(await page.$('.stimul-info')).to.be.ok()
    })

    it('should respond', function (done) {
      expect(response.status()).to.be(304)
      page.click('button').then(() => {
        page.once('response', res => {
          // response.json() is async and needs some time
          setTimeout(async () => {
            expect(await page.$eval('p', p => p.textContent)).to.equal(
              'Hello world!'
            )
            expect(await page.$('div#map')).to.be.ok()
            expect(
              (await page.$$('.leaflet-marker-pane > img')).length
            ).to.equal(10)
            done()
          }, 10)
        })
      })
    })
  })
})

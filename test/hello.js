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
  })

  describe('main page', function () {
    beforeEach(done => {
      function waitForGraphQL (res) {
        if (res._url.search('/graphql') === -1) {
          return
        }

        page.off('response', waitForGraphQL)
        done()
      }

      page
        .goto(url)
        .then(() => {
          page.on('response', waitForGraphQL)
          page.click('button')
        })
        .catch(e => done(e))
    })

    var wait = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))

    async function scrollMap (levels) {
      for (let i = 0; i < levels && i < 4; i++) {
        await page.evaluate((levels) => {
          const map = document.getElementById('map')
          const rect = map.getBoundingClientRect()
          let e = new window.Event('wheel')
          e.deltaX = 0
          e.deltaY = 3 * levels
          e.deltaZ = 0
          e.deltaMode = 1
          e.x = Math.floor(rect.x + rect.width / 2)
          e.y = Math.floor(rect.y + rect.height / 2)
          e.clientX = e.x
          e.clientY = e.y
          e.pageX = e.x
          e.pageY = e.y
          e.target = map
          map.dispatchEvent(e)
        }, levels)
      }
      await wait(300)
    }

    it('should show map', async () => {
      expect(await page.$eval('p', p => p.textContent)).to.equal('Hello world!')
      expect(await page.$('div#map')).to.be.ok()
      await page.waitForSelector('.marker-cluster', { timeout: 300 })
      expect((await page.$$('.marker-cluster')).length).to.equal(1)
      expect((await page.$$('.leaflet-marker-pane > img')).length).to.equal(1)
      await scrollMap(1)
      await wait(400)
      expect((await page.$$('.leaflet-marker-pane > img')).length).to.equal(0)
    })
  })
})

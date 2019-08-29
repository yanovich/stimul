/* test/main.js -- test main page, run it with mocha
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

const expect = require('expect.js')

const populateSites = require('./populate/sites')

let page

describe('Main page', function () {
  before(done => {
    populateSites(done)
  })

  function logger (message) {
    console.log('client:', message.text())
  }

  before(async () => {
    page = await browser.newPage()
    page.on('console', logger)
  })

  after(async () => {
    page.off('console', logger)
    await page.close()
  })

  before(done => {
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

  it('should show map', async () => {
    expect(await page.$('div#map')).to.be.ok()
  })

  describe('map', function () {
    async function scrollMap (levels) {
      await page.evaluate(levels => {
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
      await wait(300)
    }

    it('should show marker cluster', async () => {
      await page.waitForSelector('.marker-cluster', { timeout: 300 })
      expect((await page.$$('.marker-cluster')).length).to.equal(1)
      expect((await page.$$('.leaflet-marker-pane > img')).length).to.equal(1)
      await scrollMap(-1)
      await wait(400)
      expect((await page.$$('.marker-cluster')).length).to.equal(0)
      expect((await page.$$('.leaflet-marker-pane > img')).length).to.equal(3)
    })

    describe('click', function () {
      it('should offer to create site', async () => {
        const rect = await (await page.$('div#map')).boundingBox()
        let x
        let y
        x = rect.x + 20
        y = Math.floor(rect.y + rect.height / 2)
        await page.mouse.move(x, y)
        await page.mouse.down()
        x += 10
        await page.mouse.move(x, y)
        await wait(100)
        x = rect.x + 570
        y = rect.y + 25
        await page.mouse.move(x, y)
        await page.mouse.up()
        await page.click('a.leaflet-control-zoom-in')
        await page.click('div#map')
        await page.waitFor('#new-site-name', { timeout: 300 })
        await page.$eval('#new-site-name', el => {
          el.value = 'Храм'
        })
        await page.waitForSelector('button#create-new-site', { timeout: 300 })
        expect((await page.$$('.leaflet-marker-pane > img')).length).to.equal(3)
        await wait(80)
        await Promise.all([
          page.waitForResponse(
            response => {
              return response.url().search('/graphql') !== -1
            },
            { timeout: 300 }
          ),
          page.click('button#create-new-site')
        ])
        await wait(20)
        expect((await page.$$('.leaflet-marker-pane > img')).length).to.equal(4)
      })
    })
  })
})

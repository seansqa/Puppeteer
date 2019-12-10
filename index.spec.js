const runAfterQual = false

jest.setTimeout(45000)

// How many times it retries after it fails.
jest.retryTimes(1)

const env = process.env.ENV || 'staging'
const config = require('./config')[env]

const { baseDomain, baseUrl } = config

const autocompleteSelector = '#autocomplete-form-address-google'
// const autocompleteSelector = '#autocomplete-form-address-canadaPost'


const waitAndClickSelector = async (selector) => {
  if (selector.startsWith('/')) {
    await page.waitForXPath(selector)
    const element = await page.$x(selector)
    return element[0].click()
  }
  await page.waitForSelector(selector)
  return expect(page).toClick(selector)
}


const waitAndTypeSelector = async (selector, text) => {
  await page.waitForSelector(selector)
  await page.type(selector, text)
}

/*
  Adds a delay to the test
  ex. await delay(1000)
*/
const delay = time => new Promise(resolve => setTimeout(() => resolve({}), time))


const deleteAllCookies = async () => {
  const cookies = await page.cookies()
  const deleteCookies = cookies.map((cookie) => {
    return page.deleteCookie({
      name: cookie.name,
      url: cookie.url,
      domain: cookie.domain,
      path: cookie.path
    })
  })
  await Promise.all(deleteCookies)
}


describe('Eligibility', () => {
  beforeAll(async () => {
    await page.setViewport({ width: 1280, height: 1024 })
    // await page.setViewport({ width: 1920, height: 1080 })
    await page.goto(`${baseUrl}/en/shop/eligibility`)
    await page.evaluate(() => localStorage.setItem('uuid', '12345'))
  })

  beforeEach(async () => {
    await deleteAllCookies()
    /*
    const context = await browser.createIncognitoBrowserContext()
    page = await context.newPage()
    */
  })

  

  describe('SSP', () => {
    it('Fibre 15-1GB with Unit # BC address', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`)
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '3285 Townline Rd, Abbotsford, BC, Canada')

      // Enter Unit number
      await page.type('#autocomplete-form-suite', 'Main')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')
      await delay(1000)

      if (runAfterQual === true) { 
      // Click View plans CTA on GETEXTRADATA - coupon page
      const text = 'View plans'
      await waitAndClickSelector(`//a[contains(text(), "${text}")]`)

      verifyPage('ssp')

      await delay(10000)

      // Click on the first checkbox (hidden under top-product _header element)
      await waitAndClickSelector('.top-product__header')

      // Check that the commitments container exists
      await page.waitForSelector('.commitments__container') 
      }
    })

    it('Fibre 15-1GB AB address', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`)
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '285 1 St W, Drumheller, AB, Canada')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')
      await delay(1000)

      if (runAfterQual === true) {
      // Click View plans CTA on GETEXTRADATA - coupon page
      const text = 'View plans'
      await waitAndClickSelector(`//a[contains(text(), "${text}")]`)

      // Click on the first checkbox (hidden under top-product _header element)
      await waitAndClickSelector('.top-product__header')

      // Check that the commitments container exists
      await page.waitForSelector('.commitments__container')
      }
    })
  })

  describe('FOTC', () => {
    it('Fibre 15-1GB TC1', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`)
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '1859 Pineridge Dr, Merritt, BC, Canada')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')
      await delay(1000)

      if (runAfterQual === true) {
      // Wait until the Shop Internet button is visible, then click on it
      await waitAndClickSelector('a[data-qa="button-internet"]')

      // Check that the Internet 1GB exists
      await page.waitForSelector('[data-qa="button-addToCart-telus-gigabit-internet"]')
      }
    })

    it('Fibre 15-1GB TC2', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`)
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '2337 CHARDONNAY LN, ABBOTSFORD, BC')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')
      await delay(1000)

      if (runAfterQual === true) {
      // Wait until the Shop Internet button is visible, then click on it
      await waitAndClickSelector('a[data-qa="button-internet"]')

      // Check that the Internet 1GB exists
      await page.waitForSelector('[data-qa="button-addToCart-telus-gigabit-internet"]')
      }
    })

    it('Fibre 15-750, 1GB with Unit #', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`)
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '9399 Odlin Road, Richmond, BC, Canada')

      // Enter Unit number
      await page.type('#autocomplete-form-suite', '121')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')
      await delay(1000)

      if (runAfterQual === true) {
      // Wait until the Shop Internet button is visible, then click on it
      await waitAndClickSelector('a[data-qa="button-internet"]')

      // Check that the Internet 750 exists
      await page.waitForSelector('[data-qa="button-addToCart-telus-internet-750-750"]')
      }
    })

    it('Top Up Fibre 25,300,1GB', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`)
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '426 730 Cottonwood Ave, Kamloops, BC, Canada')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Wait until the Shop Internet button is visible, then click on it
      await waitAndClickSelector('a[data-qa="button-internet"]')

      if (runAfterQual === true) {
      // Check that the Internet 1GB exists
      await page.waitForSelector('[data-qa="button-addToCart-telus-internet-1g-top-up"]')
      }
    })
  })

  describe('HSC', () => {
    it('HSIA 15-300', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`,{waitUntil: 'networkidle0'})
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '6057 Doumont Rd, Nanaimo, BC')

      // Enter Unit number
      await page.type('#autocomplete-form-suite', '101')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Wait until the Shop Internet button is visible, then click on it
      await waitAndClickSelector('a[data-qa="button-internet"]')

      if (runAfterQual === true) {
      // Check that the Internet 300/300 exists
      await page.waitForSelector('[data-qa="button-addToCart-internet-300-300"]')

      // await page.waitFor(4000)
      }
    })

    it('HSIA 15-150', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`, {waitUntil: 'networkidle0'})
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '1074 Denman St, Vancouver, BC')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      if (runAfterQual === true) {
      // Wait until the Shop Internet button is visible, then click on it
      await waitAndClickSelector('a[data-qa="button-internet"]')

      // Check that the Internet 150-30 exists
      await page.waitForSelector('[data-qa="button-addToCart-internet-150-30"]')
      }
    })

    it('HSIA 15-75', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`, {waitUntil: 'networkidle0'})
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '7088 18th Avenue, Burnaby, BC')

      // Enter Unit number
      await page.type('#autocomplete-form-suite', '302')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      if (runAfterQual === true) {
      // Wait until the Shop Internet button is visible, then click on it
      await waitAndClickSelector('a[data-qa="button-internet"]')

      // Check that the Internet 75 exists
      await page.waitForSelector('[data-qa="button-addToCart-internet-75"]')
      }
    })

    it('HSIA 15-50', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`, {waitUntil: 'networkidle0'})
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '43 Falsby Way, NE Calgary, AB')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Wait until the Shop Internet button is visible, then click on it
      await waitAndClickSelector('a[data-qa="button-internet"]')

      // Check that the Internet 50 exists
      await page.waitForSelector('[data-qa="button-addToCart-internet-50"]')
    })

    it('HSIA 15 STV', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`, {waitUntil: 'networkidle0'})
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '1074 Stewart Dr, Medicine Hat, AB')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Wait until the Shop Internet button is visible, then click on it
      await waitAndClickSelector('a[data-qa="button-internet"]')

      // Check that the Internet 15 STV exists
      await page.waitForSelector('[data-qa="button-addToCart-internet-15"]')
    })

    it('HSIA 6 STV', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`, {waitUntil: 'networkidle0'})
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '10314 98 AV GRANDE CACHE AB')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Wait until the Shop Internet button is visible, then click on it
      await waitAndClickSelector('a[data-qa="button-internet"]')

      // Check that the Internet 6 STV exists
      await page.waitForSelector('[data-qa="button-addToCart-internet-6"]')
    })

    it('Smart Hub', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`, {waitUntil: 'networkidle0'})
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '3451 Ash St, Gillies Bay, BC')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Wait until the Shop Internet About button is visible, then click on it
      await waitAndClickSelector('a[data-qa="button-internet"]')

      // Check that About SmurtHub button exists
      const text = 'About SmartHub'
      await waitAndClickSelector(`//a[contains(text(), "${text}")]`)
    })

    it('Address header', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`, {waitUntil: 'networkidle0'})
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '1074 Denman St, Vancouver, BC')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Wait until the Shop Internet About button is visible, then click on it
      await waitAndClickSelector('a[data-qa="button-internet"]')

      // Click on the address bar to verify it navigates to Eli page
      const text = 'Change address'
      await waitAndClickSelector(`//a[contains(text(), "${text}")]`)

      // Enter a different address
      await waitAndTypeSelector(autocompleteSelector, '1074 Stewart Dr, Medicine Hat, AB')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Verify that the Catalog's address bar displays the last address entered in Eli page
      const address = '1074 STEWART DR'
      await page.waitForXPath(`//span[contains(text(), "${address}")]`)
    })

    it('None of the above', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`, {waitUntil: 'networkidle0'})
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '3981 Tudor Ave, Saanich, BC')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Select None of the above radio button
      await waitAndClickSelector('#none')

      // Click Continue CTA
      await waitAndClickSelector('#choose-form-submit')

      // Verify that We are still having trouble finding your address is displayed
      await page.waitForSelector('#trouble')

      // Select Try again radio button
      await waitAndClickSelector('#trouble-tryagain-1')

      // Click Trouble finding Continue CTA
      await waitAndClickSelector('#trouble-form-submit')

      // Verify that Manual entry page is displayed
      await page.waitForSelector('#manual')
      expect(await page.title()).toEqual('Check Availability | TELUS')
    })

    it('Could not find your address. Try another address', async () => {
      // Navigate to eligibility page
     await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`, {waitUntil: 'networkidle0'})
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, 'asd')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Verify that Manual entry page is displayed
      await page.waitForSelector('#manual')

      // Click Try another address link
      const text = 'Try another address'
      await waitAndClickSelector(`//span[contains(text(), "${text}")]`)

      // Verify that Eli page is displayed
      await page.waitForSelector('#autocomplete')
    })

    it('Postal Code. Manual entry form', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`, {waitUntil: 'networkidle0'})
      //await delay(1000)
      // Enter address
      await waitAndTypeSelector(autocompleteSelector, 'V6B 3K9')
      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')
      // Verify that Manual entry page is displayed
      await page.waitForSelector('#manual')
      await delay(2000)
    })

    it('Having trouble finding your address. Call in', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`, {waitUntil: 'networkidle0'})
      await delay(1000)

      // Enter address
      await page.waitForSelector(autocompleteSelector)
      await waitAndTypeSelector(autocompleteSelector, 'asd')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Verify that Manual entry page is displayed
      await page.waitForSelector('#manual')

      // 1-st loop
      // Enter street number
      await page.waitForSelector('#manual-form-streetnum')
      await page.type('#manual-form-streetnum', '2597')

      // Enter street name
      await page.type('#manual-form-streetname', 'Sunnyside')

      // Enter city
      await page.type('#manual-form-city', 'Anmore')

      // Select province
      await page.type('#manual-form-province', 'BC')

      // Click Continue CTA in Manual entry form
      await waitAndClickSelector('#manual-form-submit')

      // Verify that We are still having trouble finding your address is displayed
      await page.waitForSelector('#trouble')

      // Select Call in radio button
      await waitAndClickSelector('#trouble-callin-0')

      // Click Continue CTA in Trouble finding your address page
      await waitAndClickSelector('#trouble-form-submit')

      // Verify Sorry, we couldnt find your address. Please enter another address or call us for help.
      await page.waitForSelector('#callIn')
    })

    it('Having trouble finding your address. Request a call back', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`, {waitUntil: 'networkidle0'})
      await delay(1000)

      // Enter address
      await page.waitForSelector(autocompleteSelector)
      await waitAndTypeSelector(autocompleteSelector, 'asd')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Verify that Manual entry page is displayed
      await page.waitForSelector('#manual')

      // 1-st loop
      // Enter street number
      await page.waitForSelector('#manual-form-streetnum')
      await page.type('#manual-form-streetnum', '2597')

      // Enter street name
      await page.type('#manual-form-streetname', 'Sunnyside')

      // Enter city
      await page.type('#manual-form-city', 'Anmore')

      // Select province
      await page.type('#manual-form-province', 'BC')

      // Click Continue CTA in Manual entry form
      await waitAndClickSelector('#manual-form-submit')

      // Verify that We are still having trouble finding your address is displayed
      await page.waitForSelector('#trouble')

      // Select Request a call back radio button
      await waitAndClickSelector('#trouble-callback-0')

      // Click Continue CTA in Trouble finding your address page
      await waitAndClickSelector('#trouble-form-submit')
      await delay(2000)

      // Verify LeadGen form is displayed.
      expect(await page.title()).toEqual('Talk to our agents about TELUS Home Services | TELUS')
    })

    it('Could not find your address', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`, {waitUntil: 'networkidle0'})
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, 'asd')

      // Omit Unit No. and click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Verify that Manual entry page is displayed
      await page.waitForSelector('#manual')

      // 1-st loop
      // Enter street number
      await page.waitForSelector('#manual-form-streetnum')
      await page.type('#manual-form-streetnum', '2597')

      // Enter street name
      await page.type('#manual-form-streetname', 'Sunnyside')

      // Enter city
      await page.type('#manual-form-city', 'Anmore')

      // Select province
      await page.type('#manual-form-province', 'BC')

      // Click Manual entry form Continue CTA
      await waitAndClickSelector('#manual-form-submit')

      // Verify that We are still having trouble finding your address is displayed
      await page.waitForSelector('#trouble')

      // Select Try again radio button
      await waitAndClickSelector('#trouble-tryagain-1')

      // Click Trouble finding Continue CTA
      await waitAndClickSelector('#trouble-form-submit')

      // 2-nd loop

      // Verify that Manual entry page is displayed
      await page.waitForSelector('#manual')

      // Select another province to make the page scrolls down
      await page.type('#manual-form-province', 'AB')

      // Click Manual entry form Continue CTA
      await waitAndClickSelector('#manual-form-submit')

      // // Verify that We are still having trouble finding your address is displayed
      // await page.waitForSelector('#trouble')

      // // Select Try again radio button
      // await waitAndClickSelector('#trouble-tryagain-1')

      // // Click Trouble finding Continue CTA
      // await waitAndClickSelector('#trouble-form-submit')

      // // 3-rd loop

      // // Verify that Manual entry page is displayed
      // await page.waitForSelector('#manual')

      // // Click Continue CTA in Manual entry form
      // await waitAndClickSelector('#manual-form-submit')

      // // Verify that We are still having trouble finding your address is displayed
      // await page.waitForSelector('#trouble')

      // // Select Try again radio button
      // await waitAndClickSelector('#trouble-tryagain-1')

      // // Click Trouble finding Continue CTA
      // await waitAndClickSelector('#trouble-form-submit')

      // // Verify that Manual entry page is displayed
      // await page.waitForSelector('#manual')

      // // Click Manual entry form Continue CTA
      // await waitAndClickSelector('#manual-form-submit')

      // Verify Sorry, we couldn't find your address page is displayed
      await page.waitForSelector('#locationNotRegistered')
    })

    it('Enter missing unit', async () => {
      // Navigate to eligibility page
     await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`, {waitUntil: 'networkidle0'})
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '7088 18th Avenue, Burnaby, BC')

      // Omit Unit No. and click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Verify that Manual entry page is displayed
      await page.waitForSelector('#manual')

      // Enter unit number
      await page.waitForSelector('#manual-form-suite')
      await page.type('#manual-form-suite', '303')

      // Click Manual entry form Continue CTA
      await waitAndClickSelector('#manual-form-submit')

      // Wait until the Shop Internet button is visible, then click on it
      await waitAndClickSelector('a[data-qa="button-internet"]')

      // Check that the Internet 75 exists
      await page.waitForSelector('[data-qa="button-addToCart-internet-75"]')
    })

    it('PikTV negative STV address', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?next=https%3A%2F%2F${baseDomain}%2Fen%2Fbc%2Fshop%2Fhome%2Fpik%2Fplans&test=true&reset=true`)
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '5210 45 St, Barrhead, AB')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Select the (first) radio button
      await waitAndClickSelector('#choose-addresses-0')

      // Click Continue
      await waitAndClickSelector('#choose-form-submit')

      // Verify Sorry, PikTV is not available message is displyed
      const message = 'Sorry, Pik TV is not available at your location.'
      await page.waitForXPath(`//span[contains(text(), "${message}")]`)

      // Verify Try another address link is presented
      const text = 'Try another address'
      await page.waitForXPath(`//span[contains(., "${text}")]`)
    })

    it('PikTV negative ETTS address', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?next=https%3A%2F%2F${baseDomain}%2Fen%2Fbc%2Fshop%2Fhome%2Fpik%2Fplans&test=true&reset=true`)
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '5775 Irmin St, Burnaby, BC')

      // Enter unit number
      await page.type('#autocomplete-form-suite', '203')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Verify that Sorry, Pik TV is not available at your location statement is exists
      const message = 'Sorry, Pik TV is not available at your location.'
      await page.waitForXPath(`//span[contains(text(), "${message}")]`)

      // Verify that Get Optik TV button exists
      const text = 'Get Optik TV'
      await page.waitForXPath(`//a[contains(text(), "${text}")]`)
    })

    it('Optik P3.0', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`, {waitUntil: 'networkidle0'})
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '7088 18th Avenue, Burnaby, BC')

      // Enter Unit number
      await page.type('#autocomplete-form-suite', '302')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      await delay(2000)
      // Wait until the Shop Optik TV button is visible, then click on it
      await waitAndClickSelector('a[data-qa="button-optik"]')

      // Check that the Optik TV page is loaded (there's at least a single div inside it)
      await page.waitForSelector('#configurator')
      await delay(2000)
      expect(await page.title()).toEqual('Optik TV Plans - Choose the best plan for your home | TELUS')
    })

    it('Auto-qual', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`, {waitUntil: 'networkidle0'})
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '788 Hamilton St, Vancouver, BC, Canada')

      // Enter Unit number
      await page.type('#autocomplete-form-suite', '2110')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Wait until the Shop Internet button is visible, then click on it
      await waitAndClickSelector('a[data-qa="button-internet"]')

      // Check that the Internet 25 exists
      await page.waitForSelector('[data-qa="button-addToCart-internet-25"]')

      // Click Internet, MegaNav-GE
      await waitAndClickSelector('#main-nav-list-item-1')

      // Click Internet, Products & Services
      const text = 'Internet'
      await waitAndClickSelector(`//a[contains(text(), "${text}")]`)

      // Select Get started CTA
      const text2 = 'Get started'
      await waitAndClickSelector(`//a[contains(text(), "${text2}")]`)

      // Veryfy the Eli is skipped and previously qualified page (Internet 25) displayed
      //await page.waitForSelector('[data-qa="button-addToCartCta-internet-25-qual-exclusive"]')

      // Verify that the Catalog's address bar displays the address entered earlier
      const address = '2110 788 HAMILTON ST VAN BC'
      await page.waitForXPath(`//span[contains(text(), "${address}")]`)
    })

    it('Deferred-qual 1, Internet Plans', async () => {
      // Navigate to Internet Plans page from MegaNav
      await page.goto(`${baseUrl}/en/internet/home-internet-plans`)

      // Select Get started CTA in the address header
      const text = 'Get started' 
      await waitAndClickSelector(`//a[contains(text(), "${text}")]`)
      await delay(5000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '4516 Duart Rd, Victoria, BC Canada')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      if (runAfterQual === true) {
      // Check that the Internet 1GB exists
      await page.waitForSelector('[data-qa="button-addToCart-telus-gigabit-internet"]')
      await delay(1000)

      // Verify that the Catalog's address bar displays the address entered earlier (returns Saanich instead of Victoria)
      const address = '4516 DUART RD SAANICH BC'
      await page.waitForXPath(`//span[contains(text(), "${address}")]`)
      }
    })

    it('Deferred-qual 2, Visa $200', async () => {
      // Navigate to Internet Plans page from MegaNav
      await page.goto(`${baseUrl}/en/shop/home/internet/plans`)

      // Select Get started CTA in the address header
      await waitAndClickSelector('[data-qa="button-addressHeader"]')
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '4516 Duart Rd, Victoria, BC Canada')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Check that the Internet 1GB exists
      await page.waitForSelector('[data-qa="button-addToCart-telus-gigabit-internet"]')
      await delay(1000)

      // Verify that the Catalog's address bar displays the address entered earlier (returns Saanich instead of Victoria)
      const address = '4516 DUART RD SAANICH BC'
      await page.waitForXPath(`//span[contains(text(), "${address}")]`)
    })

    it('Shop bundles', async () => {
      // Navigate to Shop bundles eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?next=https%3A%2F%2F${baseDomain}%2Fen%2Fshop%2Fhome%2Fbundle%2Fplans&test=true&reset=true`)
      await delay(1000)
      // Enter an address
      await waitAndTypeSelector(autocompleteSelector, '8630 Shaughnessy St, Vancouver, BC')
      // Enter a Unit number
      await page.type('#autocomplete-form-suite', '202')
      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')
      // Verify the Bundles page is displayed and among other bundles, Optik 7+1 & Internet 150 bundle exists
      const message = 'Optik 7+1 & Internet 150'
      await page.waitForXPath(`//h3[contains(text(), "${message}")]`)
      await delay(5000)
    })
  })

  describe('GWP', () => {
    it('Free Projector', async () => {
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?next=https%3A%2F%2F${baseDomain}%2Fen%2Fbc%2Fshop%2Fhome%2Fproduct%2Fbenq-projector&test=true&reset=true`)
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '1074 Denman St, Vancouver, BC')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Verify message is displayed
      const text = 'BenQ 1080p Home Theatre Projector'
      await page.waitForXPath(`//h1[contains(text(), "${text}")]`)
    })

    it('Free $500 Visa. Choose page, radio button-2', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?next=https%3A%2F%2F${baseDomain}%2Fen%2Fbc%2Fshop%2Fhome%2Fproduct%2F500-visa&test=true&reset=true`)
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '418 Dollarton Highway North, North Vancouver BC')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Select the (second) radio button
      await waitAndClickSelector('#choose-addresses-1')

      // Click Continue
      await waitAndClickSelector('#choose-form-submit')

      // Verify message is displyed
      const text = '$500 Visa Prepaid Card'
      await page.waitForXPath(`//h1[contains(text(), '${text}')]`)
    })

    it('Free $200 Visa', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?next=https%3A%2F%2F${baseDomain}%2Fen%2Fbc%2Fshop%2Fhome%2Fproduct%2F200-visa&test=true&reset=true`)
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '1074 Denman St, Vancouver, BC')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Verify message is displyed
      const text = '$200 TELUS Visa Prepaid Card'
      await page.waitForXPath(`//h1[contains(text(), "${text}")]`)
    })

    it('Free TV', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?next=https%3A%2F%2F${baseDomain}%2Fen%2Fbc%2Fshop%2Fcampaign%2Foptik-4-1-netflix-free-tv-package%2Fpost&test=true&reset=true`)
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '1074 Denman St, Vancouver, BC')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Verify message is displyed
      const text = '55" Samsung 4K HDR Smart TV'
      await page.waitForXPath(`//span[contains(text(), '${text}')]`)
    })
  })

  describe('Rest of Canada', () => {
    it('ROC Address', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`)
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '25 York Street Toronto, ON, Canada')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Verify that Mobility message and Continue button to see mobility stuff is present
      await page.waitForSelector('#mobileServices')
    })

    it('Quebec address', async () => {
      // Navigate to eligibility page
      await page.goto(`${baseUrl}/en/bc/shop/eligibility?test=true&reset=true`)
      await delay(1000)

      // Enter address
      await waitAndTypeSelector(autocompleteSelector, '455 Rene-Levesque Blvd. West Montreal, Quebec, Canada H2Z 1Z3')

      // Click Check availability
      await waitAndClickSelector('#autocomplete-form-submit')

      // Verify that Manual entry page is displayed
      await page.waitForSelector('#quebec')
    })
  })

  describe('HS Fibre', () => {
    describe('Get connected flow', () => {
      it('Get connected SFU', async () => {
        // Navigate to eligibility page
        await page.goto(`${baseUrl}/en/internet/fibre/connect-to-the-purefibre-network`)

        // Click Check availability CTA
        const text = 'Check availability'
        await waitAndClickSelector(`//a[contains(text(), "${text}")]`)
        await delay(5000)

        // Enter an address
        await waitAndTypeSelector(autocompleteSelector, '5829 97 ST NW EDMONTON AB')

        // Click Check availability
        await waitAndClickSelector('#autocomplete-form-submit')

        await waitAndClickSelector('#choose-addresses-0')

        // Click Continue
        await waitAndClickSelector('#choose-form-submit')

        // Verify SFU MDU & Business options are presented and Click Single family home button
        await waitAndClickSelector('#select-building-type-sfu')
      })

      it('Get connected MDU, Give us permission form', async () => {
        // TODO: Hack to support analytics bug where page breaks without uuid.  Remove when fixed.
        await page.goto(`${baseUrl}/en/shop/eligibility`)
        await page.evaluate(() => localStorage.setItem('uuid', '12345'))

        // Navigate to eligibility page
        await page.goto(`${baseUrl}/en/internet/fibre/connect-to-the-purefibre-network`)

        // Click Check availability CTA
        const text = 'Check availability'
        await waitAndClickSelector(`//a[contains(text(), "${text}")]`)
        await delay(5000)

        // Enter an address
        await waitAndTypeSelector(autocompleteSelector, '3127 SUNNYHURST RD, NORTH VANCOUVER, BC')

        // Click Check availability
        await waitAndClickSelector('#autocomplete-form-submit')

        // Verify SFU, MDU & Business options are presented and Click Apartment or strata button
        await waitAndClickSelector('#select-building-type-mdu')

        //await page.waitFor(5000)

        // Veryfy I'm a building suite resident or owner option is present and Click Give permission CTA
        await waitAndClickSelector('//div[@id="fibre-building-card-intructions-apartment-or-condo"]//a[contains(@href,"./give-permission")]')

        await page.waitForSelector('#give-permission-form')

        await page.waitFor(4000)
      })
    })

    describe('Get connected SSP flow', () => {
      it('View plans', async () => {
        // Navigate to eligibility page
        await page.goto(`${baseUrl}/en/internet/fibre/connect-to-the-purefibre-network`)

        // Click Check availability CTA
        const text = 'Check availability'
        await waitAndClickSelector(`//a[contains(text(), "${text}")]`)
        await delay(5000)

        // Enter an address
        await waitAndTypeSelector(autocompleteSelector, '4502 27th Avenue, Vernon, BC, Canada')

        // Click Check availability
        await waitAndClickSelector('#autocomplete-form-submit')

        // Make sure View plans CTA on GETEXTRADATA - coupon page exists
        const text2 = 'View plans'
        await page.waitForXPath(`//a[contains(text(), "${text2}")]`)

        await page.waitFor(4000)
      })

      it('View PureFibre plans', async () => {
        // Navigate to eligibility page
        await page.goto(`${baseUrl}/en/internet/fibre/connect-to-the-purefibre-network`)

        // Click Check availability CTA
        const text = 'Check availability'
        await waitAndClickSelector(`//a[contains(text(), "${text}")]`)
        await delay(5000)

        // Enter an address
        await waitAndTypeSelector(autocompleteSelector, '3060 Boucherie Rd, Kelowna, BC')

        // Click Check availability
        await waitAndClickSelector('#autocomplete-form-submit')

        // Select the (first) radio button
        await waitAndClickSelector('#choose-addresses-0')

        // Click Continue
        await waitAndClickSelector('#choose-form-submit')

        // Make sure View PureFibre plans CTA in the "...Your home is already connected..." page exists
        const text2 = 'View PureFibre plans'
        await page.waitForXPath(`//a[contains(text(), "${text2}")]`)
      })
    })

    describe('Get connected HSC flow', () => {
      it('View current plans', async () => {
        // Navigate to eligibility page
        await page.goto(`${baseUrl}/en/internet/fibre/connect-to-the-purefibre-network`)

        // Click Check availability CTA
        const text = 'Check availability'
        await waitAndClickSelector(`//a[contains(text(), "${text}")]`)
        await delay(5000)

        // Enter an address
        await waitAndTypeSelector(autocompleteSelector, '1074 Stewart Dr NW, Medicine Hat, AB')

        // Click Check availability
        await waitAndClickSelector('#autocomplete-form-submit')

        // Make sure View current plans CTA on "...Fibre services are not yet available..." page exists
        const text2 = 'View current plans'
        await page.waitForXPath(`//span[contains(text(), "${text2}")]`)
      })
    })
  })
})

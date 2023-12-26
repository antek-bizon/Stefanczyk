import { addCells, getCars, serverIp, wrapInTd } from './utils.js'

const carsTable = document.getElementById('cars-table')
document.getElementById('genBtn').onclick = generateInvoices
document.getElementById('allCars').onclick = generateAllCarsInvoices
document.getElementById('carsByYear').onclick = generateCarsByYearInvoices
document.getElementById('carsByPrice').onclick = generateCarsByPriceInvoices

renderTable()
getInvoices()

function renderTable () {
  getCars()
    .then(generateTable)
    .catch(e => console.error(e))
}

function generateTable (data) {
  carsTable.innerHTML = ''
  for (const carData of data) {
    const { id, model, year, color, airbags, date, price, tax } = carData
    const tr = document.createElement('tr')
    addCells(tr, { id, model, year, color, airbags })

    const div = document.createElement('div')
    div.className = 'color-box'
    div.style.backgroundImage = `url(img/${model}.jpg)`

    tr.append(wrapInTd(div))
    addCells(tr, { date, price, tax })
    carsTable.append(tr)
  }
}

async function generateInvoices () {
  try {
    const response = await fetch(serverIp + '/generate', { method: 'POST' })
    const result = await response.json()
    generateTable(result)
  } catch (e) {
    console.error(e)
  }
}

async function generateAllCarsInvoices () {
  try {
    const response = await fetch(serverIp + '/invoiceAll', { method: 'POST' })
    const result = await response.json()
    updateLinks('allCarsLinks', result)
  } catch (e) {
    console.error(e)
  }
}

async function generateCarsByYearInvoices () {
  try {
    const year = document.getElementsByName('year')[0].value
    if (!year) {
      return
    }
    const response = await fetch(serverIp + '/invoiceByYear', {
      method: 'POST',
      body: JSON.stringify({ year: parseInt(year) })
    })
    const result = await response.json()
    updateLinks('carsByYearLinks', result)
  } catch (e) {
    console.error(e)
  }
}

async function generateCarsByPriceInvoices () {
  try {
    const min = document.getElementsByName('min')[0].value
    const max = document.getElementsByName('max')[0].value
    if (!min || !max) {
      return
    }
    const response = await fetch(serverIp + '/invoiceByPrice', {
      method: 'POST',
      body: JSON.stringify({
        from: parseInt(min),
        to: parseInt(max)
      })
    })
    const result = await response.json()
    updateLinks('carsByPriceLinks', result)
  } catch (e) {
    console.error(e)
  }
}

function updateLinks (id, result) {
  const div = document.getElementById(id)
  div.innerHTML = ''
  for (const invoice of result) {
    const text = invoice.invoiceFilename
    const link = document.createElement('a')
    link.text = 'download'
    link.title = text.slice(0, text.lastIndexOf('.'))
    link.href = `/invoice?name=${text}`
    div.append(link)
  }
}

async function getInvoice (type) {
  const response = await fetch(serverIp + type.url)
  const result = await response.json()
  updateLinks(type.div, result)
}

async function getInvoices () {
  try {
    const invoicesTypes = [
      { url: '/invoiceAll', div: 'allCarsLinks' },
      { url: '/invoiceByYear', div: 'carsByYearLinks' },
      { url: '/invoiceByPrice', div: 'carsByPriceLinks' }
    ]
    await Promise.allSettled(invoicesTypes.map(e => getInvoice(e)))
  } catch (e) {
    console.error(e)
  }
}

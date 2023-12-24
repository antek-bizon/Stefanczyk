import { createButton, defaultCells, getCars, serverIp, wrapInTd } from './js/utils.js'

const carsTable = document.getElementById('cars-table')

renderTable()

function renderTable () {
  getCars()
    .then(generateTable)
    .catch(e => console.error(e))
}

function generateTable (data) {
  carsTable.innerHTML = ''
  for (const carData of data) {
    const { pdfPath, ...car } = carData
    const tr = document.createElement('tr')
    defaultCells(tr, car)

    const genBtn = createButton({
      text: 'generate VAT invoice',
      classList: 'update',
      onClick: () => generateInvoice(car.id, car.uuid)
    })

    const downloadBtn = document.createElement('a')
    if (pdfPath) {
      downloadBtn.innerText = 'download'
      downloadBtn.href = `/invoice?id=${car.id}&uuid=${car.uuid}`
    }

    tr.append(wrapInTd(genBtn))
    tr.append(wrapInTd(downloadBtn))
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

document.getElementById('genBtn').onclick = generateInvoices

async function generateInvoice (id, uuid) {
  try {
    const response = await fetch(serverIp + '/invoice', {
      method: 'POST',
      body: JSON.stringify({ id, uuid }),
      headers: {
        'Content-Type': 'text/plain'
      }
    })
    const result = await response.json()
    generateTable(result)
  } catch (e) {
    console.error(e)
  }
}

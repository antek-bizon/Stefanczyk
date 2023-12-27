import { updateCar, addCells, deleteCar, getCars, wrapInTd, createButton } from './utils.js'

const carsTable = document.getElementById('cars-table')
const dialog = document.querySelector('dialog')
let id = null
let uuid = null

renderTable()

function renderTable () {
  getCars()
    .then(generateTable)
    .catch(e => console.error(e))
}

function showDialog (idParam, uuidParam) {
  dialog.showModal()
  id = idParam
  uuid = uuidParam
}

function closeDialog () {
  dialog.close()
  id = null
  uuid = null
}

document.getElementById('cancel').onclick = closeDialog
document.querySelector('form').onsubmit = (ev) => {
  ev.preventDefault()

  const body = JSON.stringify({
    id,
    uuid,
    model: document.getElementsByName('model')[0].value,
    year: document.getElementsByName('year')[0].value
  })

  updateCar(body)
    .then(() => {
      closeDialog()
      renderTable()
    })
    .catch(e => console.error(e))
}

function generateTable (data) {
  carsTable.innerHTML = ''
  for (const carData of data) {
    const { id, uuid, model, year, color, airbags } = carData
    const car = { id, uuid, model, year, color, airbags }

    const tr = document.createElement('tr')
    addCells(tr, car)

    const updateBtn = createButton({
      text: 'update car',
      classList: 'update',
      onClick: () => showDialog(car.id, car.uuid)
    })

    const deleteBtn = createButton({
      text: 'delete car',
      classList: 'del',
      onClick: () => {
        deleteCar(car.id, car.uuid)
          .then(renderTable)
          .catch(e => console.error(e))
      }
    })

    const uploadLink = document.createElement('a')
    uploadLink.text = 'upload'
    uploadLink.href = `/upload.html?id=${id}&uuid=${uuid}`

    const galleryLink = document.createElement('a')
    galleryLink.text = 'gallery'
    galleryLink.href = `/gallery.html?id=${id}&uuid=${uuid}`

    tr.append(wrapInTd(updateBtn))
    tr.append(wrapInTd(deleteBtn))
    tr.append(wrapInTd(uploadLink))
    tr.append(wrapInTd(galleryLink))
    carsTable.append(tr)
  }
}

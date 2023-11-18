import { updateCar, defaultCells, deleteCar, getCars, wrapInTd, createButton } from './js/utils.js'

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
  for (const car of data) {
    const tr = document.createElement('tr')
    defaultCells(tr, car)

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

    tr.append(wrapInTd(updateBtn))
    tr.append(wrapInTd(deleteBtn))
    carsTable.append(tr)
  }
}

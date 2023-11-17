const carsTable = document.getElementById('cars-table')
getCars()

document.querySelector('form').onsubmit = updateCar
const dialog = document.querySelector('dialog')
let id = null
let uuid = null

async function getCars () {
  try {
    const response  = await fetch('http://localhost:4087/cars', {
      method: 'GET'
    })

    const result = await response.json()
    console.log(result)
    carsTable.innerHTML = ''
    for (const car of result) {
      const tr = document.createElement('tr')
      generateCarCells(tr, car)

      const updateBtn = document.createElement('button')
      updateBtn.onclick = () => showDialog(car.id, car.uuid)
      updateBtn.innerText = 'update car'
      updateBtn.classList.add('btn' ,'update')

      const deleteBtn = document.createElement('button')
      deleteBtn.onclick = () => deleteCar(car.id, car.uuid)
      deleteBtn.innerText = 'delete car'
      deleteBtn.classList.add('btn' ,'del')

      tr.append(wrapInTd(updateBtn))
      tr.append(wrapInTd(deleteBtn))
      carsTable.append(tr)
    }
  } catch (e) {
    console.error(e)
  }
}

function generateCarCells(tr, car) {
  for (const key of Object.keys(car)) {
    tr.append(getTd(key, car[key]))
  }
}

function getTd(key, value) {
  const td = document.createElement('td')
  if (typeof value === 'string') {
    if (key === 'color') {
      const div = document.createElement('div')
      div.className = 'color-box'
      div.style.backgroundColor = value
      td.append(div)
    } else {
      td.innerText = value
    }
  } else if (typeof value === 'number') {
    td.innerText = value.toString()
  } else if (Array.isArray(value)) {
    const airbags = [
      "driver",
    "passenger",
    "rearSeat",
    "rearSide"
    ]
    td.innerHTML =  airbags
        .map(bag => `${bag}: ${!!value.find(e => e.name === bag)}`)
        .join('<br>')
  }

  return td
}

function wrapInTd(e) {
  const td = document.createElement('td')
  td.append(e)
  return td
}
async function deleteCar (idParam, uuidParam) {
  try {
    if (!idParam || !uuidParam) return

    const body = JSON.stringify({
      id: idParam, uuid: uuidParam
    })

    const response = await fetch('http://localhost:4087/cars', {
      method: 'DELETE',
      body,
      headers: {
        // 'Content-Type': 'application/json'
        'Content-Type': 'text/plain'
      }
    })
    const result = await response.json()
    if (result.success) {
      await getCars()
    } else {
      throw new Error('Not found')
    }
  } catch (e) {
    console.error(e)
  }
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

async function updateCar (e) {
  try {
    e.preventDefault()

    if (!id || !uuid) return

    const body = JSON.stringify({
      id, uuid,
      model: document.getElementsByName('model')[0].value,
      year: document.getElementsByName('year')[0].value
    })

    const response = await fetch('http://localhost:4087/cars', {
      method: 'PUT',
      body,
      headers: {
        // 'Content-Type': 'application/json'
        'Content-Type': 'text/plain'
      }
    })
    const result = await response.json()
    if (result.success) {
      closeDialog()
      await getCars()
    } else {
      throw new Error('Not found')
    }
  } catch (e) {
    console.error(e)
  }
}

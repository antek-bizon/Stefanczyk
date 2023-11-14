
async function deleteCar (idParam, uuidParam) {
  try {
    if (!idParam || !uuidParam) return

    const body = JSON.stringify({
      idParam, uuidParam
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
    console.log(result)
  } catch (e) {
    console.error(e)
  }
}

const dialog = document.querySelector('dialog')
let id = null
let uuid = null

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
      id, uuid
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
    console.log(result)
  } catch (e) {
    console.error(e)
  }
}

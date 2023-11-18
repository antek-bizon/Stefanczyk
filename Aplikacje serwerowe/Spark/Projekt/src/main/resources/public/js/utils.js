export async function getCars () {
  const response = await fetch('http://localhost:4087/cars', {
    method: 'GET'
  })

  return await response.json()
}

export function wrapInTd (e) {
  const td = document.createElement('td')
  td.append(e)
  return td
}

export async function deleteCar (idParam, uuidParam) {
  if (!idParam || !uuidParam) return

  const body = JSON.stringify({
    id: idParam, uuid: uuidParam
  })

  const response = await fetch('http://localhost:4087/cars', {
    method: 'DELETE',
    body,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error('Not found')
  }
}

export function defaultCells (tr, car) {
  for (const key of Object.keys(car)) {
    tr.append(getTd(key, car[key]))
  }
}

function getTd (key, value) {
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
      'driver',
      'passenger',
      'rearSeat',
      'rearSide'
    ]
    td.innerHTML = airbags
      .map(bag => `${bag}: ${!!value.find(e => e.name === bag)}`)
      .join('<br>')
  }

  return td
}

export async function updateCar (body) {
  const response = await fetch('http://localhost:4087/cars', {
    method: 'PUT',
    body,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error('Not found')
  }
}

export function createButton ({ text = '', onClick = () => { }, classList = [] }) {
  const btn = document.createElement('button')
  btn.classList.add('btn')
  if (typeof classList === 'string') {
    btn.classList.add(classList)
  } else {
    btn.classList.add(...classList)
  }
  btn.onclick = onClick
  btn.innerText = text
  return btn
}

async function send (e) {
  try {
    e.preventDefault()
    const airbags = [
      { name: 'driver', value: document.getElementsByName('driver')[0].checked },
      { name: 'passenger', value: document.getElementsByName('passenger')[0].checked },
      { name: 'rearSeat', value: document.getElementsByName('rearSeat')[0].checked },
      { name: 'rearSide', value: document.getElementsByName('rearSide')[0].checked }
    ].filter(e => e.value)
    const body = JSON.stringify({
      model: document.getElementsByName('model')[0].value,
      year: document.getElementsByName('year')[0].value,
      airbags,
      color: document.getElementsByName('color')[0].value
    })

    const response = await fetch('http://localhost:4087/add', {
      method: 'POST',
      body,
      headers: {
        // 'Content-Type': 'application/json'
        'Content-Type': 'text/plain'
      }
    })
    const result = await response.json()
    console.log(result)
    window.alert(JSON.stringify(result, null, 2))
  } catch (e) {
    console.error(e)
  }
}

const form = document.getElementsByTagName('form')[0]
form.addEventListener('submit', send)

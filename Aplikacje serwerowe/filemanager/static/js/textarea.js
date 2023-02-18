const textarea = document.querySelector('textarea')

function updateLines(textarea) {
  const numOfLines = textarea.value.split('\n').length
  document.querySelector('.line-numbers')
    .innerHTML = Array(numOfLines)
      .fill('<span></span>')
      .join('')

  textarea.style.height = `${numOfLines * 24}px`
}

textarea.onkeyup = (e) => {
  updateLines(e.target)
}

textarea.onkeydown = function (e) {
  if (e.key === 'Tab') {
    const start = this.selectionStart
    const end = this.selectionEnd

    this.value = this.value.substring(0, start) + '\t' + this.value.substring(end)

    e.preventDefault()
  }
}

updateLines(textarea)

function saveFile(filename) {
  const data = document.querySelector('textarea').value
  const body = JSON.stringify({ filename, data })
  const headers = { 'Content-Type': 'application/json' }

  fetch('/saveFile', { method: 'post', body, headers })
    .then((res) => res.json())
    .then((data) => {
      if (data.err === false) {
        window.confirm('File was successfully saved')
      } else {
        window.alert('Error ocurred during saving')
      }
    })
}

function changeFont(detla) {
  const r = document.querySelector(':root')
  const style = getComputedStyle(r)
  const newSize = parseInt(style.getPropertyValue('--font-size')) + detla
  r.style.setProperty('--font-size', `${newSize}px`)
  console.log(style.getPropertyValue('--font-size'))
}

function changeColor() {
  const r = document.querySelector(':root')
  const style = getComputedStyle(r)
  if (style.getPropertyValue('--bg-color') === 'black') {
    r.style.setProperty('--bg-color', 'white')
    r.style.setProperty('--color', 'black')
  } else {
    r.style.setProperty('--bg-color', 'black')
    r.style.setProperty('--color', 'white')
  }
}

function saveConfig() {
  const r = document.querySelector(':root')
  const style = getComputedStyle(r)
  const body = JSON.stringify({
    fontSize: style.getPropertyValue('--font-size'),
    bgColor: style.getPropertyValue('--bg-color'),
    color: style.getPropertyValue('--color')
  })
  console.log(body)
  const headers = { 'Content-Type': 'application/json' }
  fetch('/saveConfig', { method: 'post', body, headers })
    .then((res) => res.json())
    .then((data) => {
      if (data.err === false) {
        window.confirm('Config was successfully saved')
      } else {
        window.alert('Error ocurred during saving')
      }
    })
}

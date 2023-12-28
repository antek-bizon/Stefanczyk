import { serverIp } from './utils.js'

const query = new URLSearchParams(window.location.search)
const id = query.get('id')
const uuid = query.get('uuid')

const files = []

const dragDropDiv = document.getElementById('dragDrop')
const dropItemsDiv = document.getElementById('dropItems')

dragDropDiv.ondrop = (e) => {
  e.stopPropagation()
  e.preventDefault()

  const droppedFiles = e.dataTransfer.files

  files.push(...droppedFiles)
  for (const file of droppedFiles) {
    const img = document.createElement('img')
    img.src = URL.createObjectURL(file)
    dropItemsDiv.append(img)
  }
}

dragDropDiv.ondragover = (e) => {
  e.preventDefault()
}

document.getElementById('saveBtn').onclick = uploadFiles

async function uploadFiles () {
  if (files.length < 1) {
    return
  }
  const fd = new FormData()
  fd.append('id', id)
  fd.append('uuid', uuid)
  files.forEach(e => fd.append('file', e))

  try {
    const response = await fetch(serverIp + '/image', { method: 'POST', body: fd })
    const result = await response.json()
    console.log(result)
    if (response.ok && result.success === true) {
      files.length = 0
      dropItemsDiv.innerHTML = ''
      window.alert('Files uploaded')
    } else {
      window.alert('Failed to upload')
    }
  } catch (e) {
    console.error(e)
  }
}

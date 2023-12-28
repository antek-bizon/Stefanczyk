import { serverIp } from './utils.js'

const query = new URLSearchParams(window.location.search)
const id = query.get('id')
const uuid = query.get('uuid')
const img = query.get('img')
let cropMode = false

const overlay = document.getElementById('overlay')
const cropRect = document.getElementById('cropRect')
const imgDiv = document.createElement('img')
imgDiv.className = 'bigImage'
imgDiv.src = `/image?id=${id}&uuid=${uuid}&img=${img}&time=${Date.now()}`
document.getElementById('imgCont').append(imgDiv)

const cropBtn = document.getElementById('cropBtn')

cropBtn.onclick = () => {
  cropMode = !cropMode
  if (cropMode) {
    turnOnCropMode()
  } else {
    turnOffCropMode()
  }
}

function turnOffCropMode () {
  cropMode = false
  cropBtn.innerText = 'crop'
  cropRect.style.display = 'none'
  cropRect.style.width = '0px'
  cropRect.style.height = '0px'
  overlay.onmousedown = () => { }
  document.body.onmouseup = () => { }
  document.body.onmousemove = () => { }
}

function turnOnCropMode () {
  cropMode = true
  cropBtn.innerText = 'cancel crop'
  window.alert('Choose area to crop')
  overlay.onmousedown = (e1) => {
    cropRect.style.left = `${e1.pageX}px`
    cropRect.style.top = `${e1.pageY}px`
    cropRect.style.display = 'block'
    document.body.onmousemove = (e2) => {
      cropRect.style.width = `${e2.pageX - e1.pageX}px`
      cropRect.style.height = `${e2.pageY - e1.pageY}px`
    }
    document.body.onmouseup = (e2) => {
      const deltaX = e2.pageX - e1.pageX
      const deltaY = e2.pageY - e1.pageY
      modifyImage('crop', {
        x: (deltaX >= 0) ? e1.layerX : e2.layerX,
        y: (deltaY >= 0) ? e1.layerY : e2.layerY,
        width: Math.abs(deltaX),
        height: Math.abs(deltaY, imgDiv.height),
        webWidth: imgDiv.width
      })
      turnOffCropMode()
    }
  }
}

document.getElementById('rotateBtn').onclick = () => modifyImage('rotate')
document.getElementById('flipHoriBtn').onclick = () => modifyImage('flipHori')
document.getElementById('flipVertBtn').onclick = () => modifyImage('flipVert')

const reloadImg = () => { imgDiv.src = `/image?id=${id}&uuid=${uuid}&img=${img}&time=${Date.now()}` }

async function modifyImage (type, data = {}) {
  try {
    const response = await fetch(serverIp + '/modifyImage', {
      method: 'POST',
      body: JSON.stringify({
        id, uuid, img, type, data: JSON.stringify(data)
      })
    })
    const result = await response.json()
    if (result.success) {
      reloadImg()
    }
  } catch (e) {
    console.error(e)
  }
}

import { serverIp } from './utils.js'

const query = new URLSearchParams(window.location.search)
const id = query.get('id')
const uuid = query.get('uuid')

async function getImages () {
  try {
    const response = await fetch(serverIp + `/images?id=${id}&uuid=${uuid}`)
    const result = await response.json()
    const main = document.querySelector('main')
    for (const link of result) {
      const img = document.createElement('img')
      img.src = `/image?id=${id}&uuid=${uuid}&img=${link}`
      main.append(img)
    }
  } catch (e) {
    console.error(e)
  }
}

getImages()

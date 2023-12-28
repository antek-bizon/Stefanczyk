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
      const div = document.createElement('div')
      div.style.backgroundImage = `url(/image?id=${id}&uuid=${uuid}&img=${link})`
      const editLink = document.createElement('a')
      editLink.text = 'edit'
      editLink.href = `/image.html?id=${id}&uuid=${uuid}&img=${link}`
      div.append(editLink)
      main.append(div)
    }
  } catch (e) {
    console.error(e)
  }
}

getImages()

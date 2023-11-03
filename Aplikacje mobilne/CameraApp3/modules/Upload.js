import { getIpPort } from './Ip'
import Toast from 'react-native-simple-toast'

const uploadImage = async (images) => {
  try {
    const [ip, port] = await getIpPort()
    const form = new FormData()
    for (const image of images) {
      form.append('image', {
        uri: image.uri,
        type: 'image/jpeg',
        name: image.filename ?? image.uri.slice(image.uri.lastIndexOf('/'))
      })
    }

    const address = `http://${ip.value}:${port.value}/upload`
    const response = await fetch(address,
      {
        method: 'POST',
        body: form
      })

    const result = await response.text()

    if (response.ok) {
      Toast.showWithGravity(result, Toast.SHORT, Toast.CENTER)
    } else {
      throw result
    }
  } catch (e) {
    console.error(e)
  }
}

export { uploadImage }

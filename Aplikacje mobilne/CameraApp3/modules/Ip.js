import * as SecureStore from 'expo-secure-store'

const ipRegex = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/

function testPort (port) {
  if (/^[1-9]([0-9]+)?$/.test(port)) {
    const intPort = parseInt(port)
    return (intPort <= 65535)
  }

  return false
}

async function getIpPort () {
  return await Promise.allSettled([
    SecureStore.getItemAsync('ip'), SecureStore.getItemAsync('port')])
}

async function setIpPort (ip, port) {
  try {
    await Promise.allSettled([
      SecureStore.setItemAsync('ip', ip), SecureStore.setItemAsync('port', port)
    ])
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

export { ipRegex, testPort, getIpPort, setIpPort }

import { useEffect, useState } from 'react'
import { Button, Dialog, TextInput, useTheme } from 'react-native-paper'
import * as SecureStore from 'expo-secure-store'
import LoadingScreen from './LoadingScreen'
import Toast from 'react-native-simple-toast'

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

export default function IpDialog ({ hideDialog }) {
  const [ip, setIp] = useState({ val: '' })
  const [port, setPort] = useState({ val: '' })
  const theme = useTheme()
  const [loading, setLoading] = useState(true)

  const areCorrect = () => {
    return ip.correct && port.correct
  }

  useEffect(() => {
    getIpPort()
      .then(arr => {
        setIp({ val: arr[0].value, correct: ipRegex.test(arr[0].value) })
        setPort({ val: arr[1].value, correct: testPort(arr[1].value) })
        setLoading(false)
      })
      .catch(e => console.error(e))
  }, [])

  const onSet = () => {
    setLoading(true)
    setIpPort(ip.val, port.val)
      .then((res) => {
        if (res) {
          Toast.showWithGravity('Paramiters set', Toast.SHORT, Toast.CENTER)
          hideDialog()
        } else {
          console.error('Failed to set paramiters')
        }
        setLoading(false)
      })
      .catch(e => console.error(e))
  }

  return (
    <>
      <Dialog
        visible
        onDismiss={hideDialog}
      >
        <Dialog.Title>Set server paramiters</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label='IP address'
            mode='outlined'
            error={typeof ip.correct !== 'undefined' && !ip.correct}
            value={ip.val}
            activeOutlineColor={theme.colors.secondary}
            keyboardType='number-pad'
            onChangeText={(e) => {
              if (ipRegex.test(e)) {
                setIp({ val: e, correct: true })
              } else {
                setIp({ val: e })
              }
            }}
            onEndEditing={() => setIp({ val: ip.val, correct: ipRegex.test(ip.val) })}
          />
          <TextInput
            label='Port' keyboardType='number-pad'
            mode='outlined'
            activeOutlineColor={theme.colors.secondary}
            error={typeof port.correct !== 'undefined' && !port.correct}
            value={port.val}
            onChangeText={(e) => {
              if (testPort(e)) {
                setPort({ val: e, correct: true })
              } else {
                setPort({ val: e })
              }
            }}
            onEndEditing={() => setPort({ val: port.val, correct: testPort(port.val) })}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Cancel</Button>
          <Button onPress={onSet} disabled={!areCorrect()}>Set</Button>
        </Dialog.Actions>
      </Dialog>
      {loading ? <LoadingScreen /> : null}
    </>
  )
}

import { Text, useTheme } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import BigButton from './BigButton'
import { Accelerometer } from 'expo-sensors'

const serverIp = '192.168.8.126:3000'

export default function MainPage () {
  const theme = useTheme()
  const [{ x, y, z }, setDataHandle] = useState({
    x: 0,
    y: 0,
    z: 0
  })
  const setData = ({ x, y, z }) => {
    x = parseFloat((x * 100).toPrecision(10))
    y = parseFloat((y * 100).toPrecision(10))
    z = parseFloat((z * 100).toPrecision(10))
    setDataHandle({ x, y, z })
  }
  const [subscription, setSubscription] = useState(null)

  const subscribe = () => setSubscription(Accelerometer.addListener(setData))
  const unsubscribe = () => {
    subscription && subscription.remove()
    setSubscription(null)
  }

  const [connection, setConnection] = useState(false)
  const ws = useRef(null)

  useEffect(() => {
    Accelerometer.setUpdateInterval(50)

    return () => {
      unsubscribe()
      disconnect()
    }
  }, [])

  const connect = () => {
    const url = 'ws://' + serverIp
    console.log(url)
    ws.current = new WebSocket(url)
    ws.current.onopen = () => {
      setConnection(true)
      ws.current.send(JSON.stringify({ route: 'connected', type: 'mobile' }))
    }
    ws.current.onclose = (e) => {
      setConnection(false)
      console.log(e.code, e.reason)
    }
    ws.current.onmessage = (e) => {
      console.log(e.data)
    }
    ws.current.onerror = (e) => {
      console.error(e.message)
    }
  }

  const disconnect = () => {
    if (ws.current) {
      ws.current.close()
    }
  }

  useEffect(() => {
    if (connection) {
      // console.log('sending', x, y, z)
      ws.current.send(JSON.stringify({ route: 'data', data: { x, y, z } }))
    }
  }, [x, y, z])

  return (
    <View style={[styles.main, { backgroundColor: theme.colors.secondary }]}>
      <BigButton
        text={subscription ? 'Turn off' : 'Turn on'}
        onPress={subscription ? unsubscribe : subscribe}
      />
      <View style={[styles.data, { backgroundColor: theme.colors.primaryContainer }]}>
        <Text style={{ color: theme.colors.onPrimaryContainer }} variant='headlineMedium'>x: {x}</Text>
        <Text style={{ color: theme.colors.onPrimaryContainer }} variant='headlineMedium'>y: {y}</Text>
        <Text style={{ color: theme.colors.onPrimaryContainer }} variant='headlineMedium'>z: {z}</Text>
      </View>
      <BigButton
        text={connection ? 'Disconnect' : 'Connect'}
        onPress={connection ? disconnect : connect}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  data: {
    borderRadius: 30,
    paddingVertical: '8%',
    paddingHorizontal: '20%',
    gap: 15
  }
})

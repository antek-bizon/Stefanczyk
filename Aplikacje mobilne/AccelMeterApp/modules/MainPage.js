import { Text, useTheme } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import BigButton from './BigButton'
import { Accelerometer } from 'expo-sensors'

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
    Accelerometer.setUpdateInterval(500)

    return () => {
      unsubscribe()
    }
  }, [])

  const connect = () => {
    ws.current = new WebSocket()
    ws.current.onopen = () => {
      setConnection(true)
    }
    ws.current.onclose = () => {
      setConnection(false)
    }
    ws.current.onmessage = () => {

    }
    ws.current.onerror = (e) => {
      console.error(e.message)
    }
  }

  const disconnect = () => {}

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

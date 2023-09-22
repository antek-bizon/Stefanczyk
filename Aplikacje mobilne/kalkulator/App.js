import { useState } from 'react'
import { Dimensions, StyleSheet, View, StatusBar, Text } from 'react-native'
import NumKeyboard from './modules/NumKeyboard'

export default function App () {
  const isPortrait = () => {
    const dim = Dimensions.get('screen')
    return dim.height >= dim.width
  }

  const [screenOrientation, setScreenOrientation] = useState(isPortrait())

  Dimensions.addEventListener('change', () => {
    setScreenOrientation(isPortrait())
  })

  const [operation, setOperation] = useState('')
  let result = ''
  try {
    /* eslint-disable no-eval */
    result = eval(operation)
  } catch {
  }

  return (
    <View style={styles.main}>
      <StatusBar style='auto' />
      <Text style={styles.operiation}>{operation}</Text>
      <Text style={styles.result}>{result}</Text>
      <NumKeyboard
        isPortrait={screenOrientation}
        operation={operation}
        setOperation={setOperation}
        result={result}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#444'
  },

  operiation: {
    width: '100%',
    textAlign: 'right',
    fontSize: 45,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginTop: 10,
    color: 'white'
  },

  result: {
    width: '100%',
    textAlign: 'right',
    fontSize: 30,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#333',
    color: 'white'
  }
})

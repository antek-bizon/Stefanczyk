import { StyleSheet, TouchableOpacity, View } from 'react-native'
import * as Font from 'expo-font'
import { useEffect, useState } from 'react'
import { Heading, Text, useTheme } from 'native-base'

const StartingPage = ({ setState }) => {
  const [isFontLoaded, setFontLoaded] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    Font.loadAsync({
      myFont: require('../assets/fonts/Quicksand-VariableFont_wght.ttf')
    }).then(() => {
      setFontLoaded(true)
    })
  })

  return (
    <View style={[styles.main, {backgroundColor: theme.colors.secondary[500]}]}>
      {isFontLoaded && (
        <TouchableOpacity style={styles.container} onPress={() => setState('main')}>
          <Heading style={[{ fontFamily: 'myFont' }, styles.header]} fontSize='4xl'>Camera App</Heading>
          <Text style={{ fontFamily: 'myFont' }} fontSize='lg'>Take and manage your photos</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 70
  },

  header: {
    fontWeight: 'bold',
    paddingBottom: 5
  }
})

export default StartingPage

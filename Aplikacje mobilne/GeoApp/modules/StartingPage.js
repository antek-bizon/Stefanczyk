import { Text, useTheme } from 'react-native-paper'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import * as Font from 'expo-font'
import { useEffect, useState } from 'react'

const StartingPage = ({ mainPage }) => {
  const theme = useTheme()
  const [isFontLoaded, setFontLoaded] = useState(false)

  useEffect(() => {
    Font.loadAsync({
      myFont: require('../assets/fonts/Quicksand-VariableFont_wght.ttf')
    }).then(() => {
      setFontLoaded(true)
    })
  })

  return (
    <View style={[styles.main, { backgroundColor: theme.colors.primary }]}>
      {isFontLoaded && (
        <TouchableOpacity style={styles.container} onPress={() => mainPage()}>
          <Text style={[{ fontFamily: 'myFont', color: theme.colors.surface }, styles.header]} variant='displayMedium'>GeoApp</Text>
          <Text style={{ fontFamily: 'myFont', color: theme.colors.surface }} variant='bodyLarge'>Find and save your position</Text>
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

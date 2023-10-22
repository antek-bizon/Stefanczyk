import { StyleSheet, TouchableOpacity, View } from 'react-native'
import * as Font from 'expo-font'
import { useEffect, useState } from 'react'
import { Text, useTheme } from 'react-native-paper'

export default function StartingPage ({ openApp }) {
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
        <TouchableOpacity style={styles.container} onPress={() => openApp(true)}>
          <Text style={{ fontFamily: 'myFont', color: theme.colors.onPrimary }} variant='displayMedium'>Camera App</Text>
          <Text style={{ fontFamily: 'myFont', color: theme.colors.onPrimary }} variant='bodyLarge'>Take and manage your photos</Text>
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
  }
})

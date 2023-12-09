import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text, TouchableRipple, useTheme } from 'react-native-paper'

function random (max) {
  return Math.floor(Math.random() * max)
}

function randomColor () {
  return `rgba(${random(255)}, ${random(255)}, ${random(255)}, 0.9)`
}

export default function StartingPage ({ navigation }) {
  const theme = useTheme()
  const [color, setColor] = useState(randomColor())

  //   const description = (
  //     <View style={{ alignItems: 'center' }}>
  //       {['Manage sqlite', 'Use animation', 'Use ring'].map(
  //         (e, i) => <Text style={{ color: theme.colors.onPrimary }} variant='bodyLarge' key={i}>{e}</Text>
  //       )}
  //     </View>
  //   )

  const onPressHandle = () => {
    navigation.navigate('Main page')
    setTimeout(() => setColor(randomColor()), 500)
  }

  return (
    <TouchableRipple
      rippleColor={color}
      onPress={onPressHandle}
      style={[styles.main, { backgroundColor: theme.colors.primary }]}
    >
      <>
        <Text style={{ color: theme.colors.onPrimary }} variant='displayMedium'>AccelMeterApp</Text>
      </>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  }
}
)

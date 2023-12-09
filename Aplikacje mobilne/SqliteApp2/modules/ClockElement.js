import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

export default function ClockElement ({ text, onPress, innerRing, left, top, size }) {
  const theme = useTheme()

  return (
    <TouchableOpacity
      style={[styles.circle, {
        transform: [{ translateX: left - size / 2 }, { translateY: top - size / 2 }],
        width: size,
        height: size,
        backgroundColor:
          (!innerRing) ? theme.colors.inversePrimary : theme.colors.tertiaryContainer

      }]}
      onPress={onPress}
    >
      <Text variant={(!innerRing) ? 'headlineSmall' : 'bodyLarge'}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: 30,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '5%'
  }
  // text: {
  //   // aspectRatio: 1 / 1,
  //   textAlign: 'center'
  // }
})

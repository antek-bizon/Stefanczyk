import { StyleSheet, View } from 'react-native'
import { Text, TouchableRipple, useTheme } from 'react-native-paper'

export default function ClockElement ({ text, onPress, innerRing, left, top, size }) {
  const theme = useTheme()

  return (
    <View
      style={[styles.circle, {
        transform: [{ translateX: left - size / 2 }, { translateY: top - size / 2 }],
        width: size,
        height: size,
        backgroundColor:
          (!innerRing) ? theme.colors.inversePrimary : theme.colors.tertiaryContainer

      }]}
    >
      <TouchableRipple
        style={styles.touchable}
        rippleColor={(!innerRing) ? theme.colors.primary : theme.colors.tertiary}
        onPress={onPress}
      >
        <Text variant={(!innerRing) ? 'headlineSmall' : 'bodyLarge'}>{text}</Text>
      </TouchableRipple>
    </View>
  )
}

const styles = StyleSheet.create({
  circle: {
    overflow: 'hidden',
    borderRadius: 30,
    position: 'absolute'
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '5%'
  }
})

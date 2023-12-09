import { StyleSheet, View } from 'react-native'
import { Text, TouchableRipple, useTheme } from 'react-native-paper'

export default function BigButton ({ text = '', onPress = () => {} }) {
  const theme = useTheme()

  return (
    <View style={styles.bigButton}>
      <TouchableRipple
        style={[styles.main, { backgroundColor: theme.colors.primary }]}
        rippleColor={theme.colors.inversePrimary}
        onPress={onPress}
      >
        <Text style={{ color: theme.colors.onPrimary }} variant='headlineSmall'>{text}</Text>
      </TouchableRipple>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bigButton: {
    width: 120,
    height: 120,
    borderRadius: 50,
    backgroundColor: 'blue',
    overflow: 'hidden'
  }
})

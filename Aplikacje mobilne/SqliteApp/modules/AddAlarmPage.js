import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

export default function AddAlarmPage ({ navigation }) {
  const theme = useTheme()

  return (
    <TouchableOpacity
      style={[styles.main, { backgroundColor: theme.colors.secondary }
      ]}
      onPress={() => {
        navigation.navigate('Main page', { toAdd: {} })
      }}
    >
      <Text style={[styles.text, { color: theme.colors.onSecondary }]} variant='displaySmall'>Click to add a new alarm</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  },

  text: {
    textAlign: 'center'
  }
})

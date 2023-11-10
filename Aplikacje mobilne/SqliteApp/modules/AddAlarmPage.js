import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

export default function AddAlarmPage ({ navigation, route }) {
  const theme = useTheme()
  const onAdd = route.params.onAdd

  return (
    <TouchableOpacity
      style={[styles.main, { backgroundColor: theme.colors.secondary }
      ]}
      onPress={() => {
        onAdd()
        navigation.navigate('Main page')
      }}
    >
      <Text style={styles.text} variant='displaySmall'>Click to add a new alarm</Text>
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

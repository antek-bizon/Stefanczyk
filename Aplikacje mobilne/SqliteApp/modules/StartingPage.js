import { View } from 'react-native'
import { Text, TouchableRipple, useTheme } from 'react-native-paper'

export default function StartingPage ({ navigation }) {
  const theme = useTheme()

  const description = (
    <View style={{ alignItems: 'center' }}>
      {['Manage sqlite', 'Use animation', 'Use ring'].map(
        (e, i) => <Text style={{ color: theme.colors.onPrimary }} variant='bodyLarge' key={i}>{e}</Text>
      )}
    </View>
  )

  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      backgroundColor: theme.colors.primary
    }}
    >
      <TouchableRipple onPress={() => navigation.navigate('Main page')}>
        <Text style={{ borderRadius: 30, padding: 10, color: theme.colors.onPrimary }} variant='displayLarge'>SqliteApp</Text>
      </TouchableRipple>
      {description}

    </View>
  )
}

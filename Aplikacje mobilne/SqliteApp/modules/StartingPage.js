import { View } from 'react-native'
import { Text, TouchableRipple, useTheme } from 'react-native-paper'

export default function StartingPage ({ navigation }) {
  const theme = useTheme()

  const description = (
    <View style={{ alignItems: 'center' }}>
      {['manage sqlite', 'use animation', 'use ring'].map(
        (e, i) => <Text variant='bodyLarge' key={i}>{e}</Text>
      )}
    </View>
  )

  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      backgroundColor: theme.colors.primary,
      gap: 10
    }}
    >
      <TouchableRipple borderless onPress={() => navigation.navigate('Main page')}>
        <Text variant='displayLarge'>SqliteApp</Text>
      </TouchableRipple>
      {description}

    </View>
  )
}

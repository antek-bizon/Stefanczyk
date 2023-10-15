import { View } from 'react-native'
import { Text } from 'react-native-paper'

export default function Radio ({ items }) {
  return (
    <View>
      {items.map((e, i) => (
        <Text key={i}>{i}</Text>
      ))}
    </View>
  )
}

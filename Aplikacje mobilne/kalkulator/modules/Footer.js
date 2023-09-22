import { StyleSheet, Text, View } from 'react-native'

export default function Footer () {
  return (
    <View style={styles.footer}>
      <Text>Footer</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: 'green',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

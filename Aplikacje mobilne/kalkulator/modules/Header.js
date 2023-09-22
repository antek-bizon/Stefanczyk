import { StyleSheet, Text, View } from 'react-native'

export default function Header () {
  return (
    <View style={styles.header}>
      <Text>Mr Ziółko</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: 'red',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

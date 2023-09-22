import { StyleSheet, Text, TouchableOpacity } from 'react-native'

export default function Container ({ text }) {
  return (
    <TouchableOpacity style={styles.container}>
      <Text>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: 'cornflowerblue',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

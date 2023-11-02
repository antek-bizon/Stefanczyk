import { StyleSheet, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

export default function LoadingScreen ({ relative }) {
  const viewStyle = (relative) ? styles.relative : styles.absolute

  return (
    <View style={[viewStyle, styles.bg]}>
      <ActivityIndicator style={styles.spinner} size='large' />
    </View>
  )
}

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },

  relative: {
    flex: 1
  },

  bg: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 10, 10, 0.2)'
  },

  spinner: {
    paddingBottom: 40
  }
})

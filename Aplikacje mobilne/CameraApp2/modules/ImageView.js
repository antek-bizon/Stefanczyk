import { useEffect, useState } from 'react'
import { BackHandler, Image, StyleSheet, View } from 'react-native'
import * as Sharing from 'expo-sharing'
import { Button } from 'react-native-paper'
import AppBar from './AppBar'

export default function ImageView ({ image, goBack, deleteImage }) {
  const [isAvailable, setAvailable] = useState(false)

  useEffect(() => {
    Sharing.isAvailableAsync()
      .then(v => {
        if (v) {
          setAvailable(v)
        }
      })
      .catch(e => console.error(e))

    const handle = () => {
      goBack()
      return true
    }

    BackHandler.addEventListener('hardwareBackPress', handle)
    return () => BackHandler.removeEventListener('hardwareBackPress', handle)
  }, [])

  const share = () => {
    if (isAvailable) {
      Sharing.shareAsync(image.uri)
        .catch(e => console.error(e))
    }
  }

  return (
    <>
      <AppBar title='Viewer' onPress={goBack} />
      <View style={[styles.flex1, { justifyContent: 'space-between' }]}>
        <View style={styles.imageContainer}>
          <Image
            resizeMode='contain' alt={image.filename}
            source={{ uri: image.uri }} style={styles.flex1}
          />
        </View>
        <View style={[styles.flex1, styles.row]}>
          <Button mode='contained' onPress={share} disabled={!isAvailable}>Share</Button>
          <Button mode='contained' onPress={() => deleteImage(image.id)}>Delete</Button>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },

  imageContainer: {
    flex: 3,
    margin: 5
  }
})

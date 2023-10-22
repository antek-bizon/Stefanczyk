import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import { IconButton, Surface, Text } from 'react-native-paper'

export default function GalleryItem ({ selectedImages, image, selectImage, viewImage }) {
  const isSelected = selectedImages.has(image.id)

  const contents = (
    <View style={styles.content}>
      <Image style={styles.flex1} resizeMode='cover' source={{ uri: image.uri }} alt={image.filename} />
      <View style={styles.overlay}>
        <Text style={styles.text} variant='bodySmall'>{image.filename}</Text>
      </View>
      {
        isSelected && (
          <View style={[styles.overlay, { height: '100%' }]}>
            <IconButton iconColor='white' icon='check' size={40} />
          </View>
        )
      }
    </View>
  )

  return (
    <Surface style={styles.main} elevation={4}>
      {isSelected
        ? <Pressable style={[styles.flex1]} onPress={() => selectImage(image.id)}>{contents}</Pressable>
        : (
          <TouchableOpacity
            onPress={() => viewImage(image.id)} onLongPress={() => selectImage(image.id)}
            delayLongPress='400'
          >{contents}
          </TouchableOpacity>)}
    </Surface>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 1,
    margin: 5,
    borderRadius: 20
  },

  content: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 150,
    borderColor: 'gray',
    borderWidth: 1,
    position: 'relative'
  },

  flex1: {
    flex: 1
  },

  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(0, 10, 20, 0.5)',
    position: 'absolute',
    bottom: 0
  },

  text: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    color: 'white'
  }
})

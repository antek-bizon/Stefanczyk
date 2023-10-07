import { Box, Button, HStack, Image } from 'native-base'
import AppBar from './Appbar'
import * as Sharing from 'expo-sharing'
import { useEffect, useState } from 'react'

const ImageView = ({ image, goBack, deleteImage }) => {
  const [isAvailable, setAvailable] = useState(false)

  useEffect(() => {
    Sharing.isAvailableAsync()
      .then(v => {
        if (v) {
          setAvailable(v)
        }
      })
      .catch(e => console.error(e))
  }, [])

  const share = () => {
    if (isAvailable) {
      Sharing.shareAsync(image.uri)
        .catch(e => console.error(e))
    }
  }

  return (
    <>
      <AppBar title='Viewer' backAction={goBack} />
      <Box flex='1'>
        <Box m='5' rounded='lg' overflow='hidden' flex='2.5' borderColor='gray.300' borderWidth='1' position='relative'>
          <Image flex='1' resizeMode='cover' alt={image.filename} source={{ uri: image.uri }} />
        </Box>
        <HStack flex='1' justifyContent='space-evenly' alignItems='center'>
          <Button size='lg' isDisabled={!isAvailable} onPress={() => share()}>Share</Button>
          <Button size='lg' onPress={() => deleteImage(image.id)}>Delete</Button>
        </HStack>
      </Box>
    </>
  )
}

export default ImageView

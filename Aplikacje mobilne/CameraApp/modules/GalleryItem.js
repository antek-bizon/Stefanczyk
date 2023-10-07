import { Box, Center, CheckIcon, Heading, Image, Pressable } from 'native-base'
import { TouchableOpacity } from 'react-native'

const GalleryItem = ({ selectedImages, image, selectImage, viewImage }) => {
  const isSelected = selectedImages.has(image.id)

  const contents = (
    <Box rounded='lg' overflow='hidden' h='100' borderColor='gray.300' borderWidth='1' position='relative'>
      <Image flex='1' resizeMode='cover' alt={image.filename} source={{ uri: image.uri }} />
      <Center w='100%' position='absolute' bottom='0' bgColor='rgba(0, 10, 20, 0.5)'>
        <Heading py='5%' fontSize='2xs' color='lightText'>{image.filename}</Heading>
      </Center>
      {
        isSelected && (
          <Center position='absolute' top='0' w='100%' h='100%' bgColor='rgba(10, 10, 10, 0.5)'>
            <CheckIcon color='white' size='lg' />
          </Center>)
      }
    </Box>
  )

  return (
    <Box p='1' flex='1'>
      {isSelected
        ? <Pressable onPress={() => selectImage(image.id)}>{contents}</Pressable>
        : (
          <TouchableOpacity
            onPress={() => viewImage(image.id)} delayLongPress='500' onLongPress={() => selectImage(image.id)}
          >
            {contents}
          </TouchableOpacity>)}
    </Box>
  )
}

export default GalleryItem

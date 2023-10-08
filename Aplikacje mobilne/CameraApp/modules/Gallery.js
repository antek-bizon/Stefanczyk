import { Button, Center, HStack, Spinner } from 'native-base'
import AppBar from './Appbar'
import { useCallback, useState } from 'react'
import GalleryItem from './GalleryItem'
import { FlashList } from '@shopify/flash-list'

const Gallery = ({ closeApp, images, viewImage, deleteImages, cameraPage }) => {
  const startingPage = () => {
    closeApp(false)
  }

  const [numCol, setNumCol] = useState(3)
  const [selectedImages, setSelectedImages] = useState(new Set())

  const menuButtons = [
    { title: 'Layout', handlePress: useCallback(() => { if (numCol === 3) setNumCol(1); else setNumCol(3) }, [numCol]) },
    { title: 'Camera', handlePress: cameraPage },
    {
      title: 'Delete',
      handlePress: useCallback(() => {
        const toDelete = Array.from(selectedImages.values())
        if (toDelete.length > 0) {
          setSelectedImages(new Set())
          deleteImages(toDelete)
        }
      }, [selectedImages]),
      isDisabled: typeof selectedImages.values().next().value === 'undefined'
    }
  ].map((e, i) => (
    <Button
      size='lg' key={i}
      isDisabled={e.isDisabled}
      onPress={e.handlePress}
    >{e.title}
    </Button>))

  const selectImage = useCallback((id) => {
    if (selectedImages.has(id)) {
      selectedImages.delete(id)
      setSelectedImages(new Set(selectedImages))
    } else {
      setSelectedImages(new Set(selectedImages.add(id)))
    }
  }, [selectedImages])

  const renderItem = ({ item, index, extraData }) => (
    <GalleryItem
      key={index} image={item}
      selectedImages={extraData}
      selectImage={selectImage}
      viewImage={viewImage}
    />
  )

  return (
    <>
      <AppBar title='Photos inside DCIM' backAction={startingPage} />
      <HStack p='2.5' justifyContent='space-evenly'>
        {
          menuButtons
        }
      </HStack>
      {images
        ? (
          // <FlatList
          //   key={numCol === 3 ? 'grid' : 'list'}
          //   numColumns={numCol}
          //   flex='1'
          //   px='1'
          //   data={images}
          //   keyExtractor={item => item.id}
          //   renderItem={renderItem}
          //   initialNumToRender={3 * 6}
          //   maxToRenderPerBatch={3 * 7}
          // />
          <FlashList
            data={images}
            renderItem={renderItem}
            extraData={selectedImages}
            estimatedItemSize={150}
            numColumns={numCol}
          />)
        : <Center flex='1'><Spinner pb='20' size='xl' color='secondary.500' accessibilityLabel='Loading images' /></Center>}

    </>
  )
}

export default Gallery

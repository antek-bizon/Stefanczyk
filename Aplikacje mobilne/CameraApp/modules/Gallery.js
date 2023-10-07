import { Button, Center, FlatList, HStack, Spinner } from 'native-base'
import AppBar from './Appbar'
import { useState } from 'react'
import GalleryItem from './GalleryItem'

const Gallery = ({ closeApp, images, viewImage, deleteImages, cameraPage }) => {
  const startingPage = () => {
    closeApp(false)
  }

  const [numCol, setNumCol] = useState(3)
  const [selectedImages, setSelectedImages] = useState(new Set())

  const menuButtons = [
    { title: 'Layout', func: () => { if (numCol === 3) setNumCol(1); else setNumCol(3) } },
    { title: 'Camera', func: cameraPage },
    {
      title: 'Delete',
      func: () => {
        const toDelete = Array.from(selectedImages.values())
        if (toDelete.length > 0) {
          setSelectedImages(new Set())
          deleteImages(toDelete)
        }
      },
      isDisabled: typeof selectedImages.values().next().value === 'undefined'
    }
  ].map((e, i) => (
    <Button
      size='lg' key={i}
      isDisabled={e.isDisabled}
      onPress={() => { if (e.func) e.func() }}
    >{e.title}
    </Button>))

  const renderItem = ({ item, index }) => (
    <GalleryItem
      key={index} image={item}
      selectedImages={selectedImages} selectImage={selectImage}
      viewImage={viewImage}
    />
  )

  const selectImage = (id) => {
    if (selectedImages.has(id)) {
      selectedImages.delete(id)
      setSelectedImages(new Set(selectedImages))
    } else {
      setSelectedImages(new Set(selectedImages.add(id)))
    }
  }

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
          <FlatList
            key={numCol === 3 ? 'grid' : 'list'}
            numColumns={numCol}
            flex='1'
            px='1'
            data={images}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            initialNumToRender={3 * 6}
            maxToRenderPerBatch={3 * 7}
          />)
        : <Center flex='1'><Spinner pb='20' size='lg' color='secondary.500' accessibilityLabel='Loading images' /></Center>}

    </>
  )
}

export default Gallery

import { VStack } from 'native-base'
import Gallery from './Gallery'
import { useCallback, useEffect, useState } from 'react'
import * as MediaLibrary from 'expo-media-library'
import { Alert, BackHandler } from 'react-native'
import Toast from 'react-native-simple-toast'
import ImageView from './ImageView'
import CameraPage from './CameraPage'

const getAssets = async () => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permissions to read images were not granted')
    }
    const assets = await MediaLibrary.getAssetsAsync({
      sortBy: 'modificationTime',
      first: 3 * 10,
      mediaType: 'photo'
    })
    const map = new Map()
    assets.assets.forEach((e) => map.set(e.id, { id: e.id, uri: e.uri, filename: e.filename }))
    return map
  } catch (e) {
    console.error(e)
  }
}

const MainPage = ({ closeApp }) => {
  const [currentPage, setPage] = useState({ name: 'gallery', images: null })

  useEffect(() => {
    getAssets()
      .then(map => setPage(prev => ({ name: prev.name, images: map })))
      .catch(e => console.error(e))

    const handle = () => {
      closeApp()
      return true
    }

    BackHandler.addEventListener('hardwareBackPress', handle)
    return () => BackHandler.removeEventListener('hardwareBackPress', handle)
  }, [])

  const deleteImages = useCallback((ids) => {
    MediaLibrary.deleteAssetsAsync(ids)
      .then(res => {
        if (res) {
          const msg = (ids.length < 2) ? 'Image' : 'Images'
          Toast.show(msg + ' deleted successfully', Toast.SHORT)
          gallery()
        } else {
          Toast.show('Failed to delete images', Toast.SHORT)
        }
      })
      .catch(e => console.error(e))
  }, [])

  const deleteImage = (id) => {
    deleteImages([id])
  }

  const viewImage = (id) => {
    setPage(prev => ({ ...prev, name: 'view', imageId: id }))
  }

  const gallery = () => {
    setPage(({ name: 'gallery', images: null }))
    getAssets()
      .then(map => setPage(({ name: 'gallery', images: map })))
      .catch(e => console.error(e))
  }

  const cameraPage = () => {
    setPage(prev => ({ ...prev, name: 'camera' }))
  }

  const page = () => {
    switch (currentPage.name) {
      case 'gallery':
        return (
          <Gallery
            images={currentPage.images ? Array.from(currentPage.images.values()) : null}
            closeApp={closeApp}
            deleteImages={deleteImages}
            viewImage={viewImage}
            cameraPage={cameraPage}
          />
        )
      case 'view':
        return (
          <ImageView
            image={currentPage.images.get(currentPage.imageId)}
            goBack={gallery}
            deleteImage={deleteImage}
          />
        )
      case 'camera':
        return (
          <CameraPage goBack={gallery} />
        )
      default:
        return <></>
    }
  }

  return (
    <VStack flex='1'>
      {page()}
    </VStack>
  )
}

export default MainPage

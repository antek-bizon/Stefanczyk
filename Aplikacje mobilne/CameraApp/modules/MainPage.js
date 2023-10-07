import { VStack, useToast } from 'native-base'
import Gallery from './Gallery'
import { useEffect, useState } from 'react'
import * as MediaLibrary from 'expo-media-library'
import { Alert } from 'react-native'
import ImageView from './ImageView'
import CameraPage from './CameraPage'

const MainPage = ({ closeApp }) => {
  // const images = new Array(20)
  // images.fill({
  //   src: 'https://cdn.pixabay.com/photo/2017/02/01/22/02/mountain-landscape-2031539_640.jpg',
  //   description: 'Landscape'
  // })

  const [images, setImages] = useState(null)
  const [currentPage, setPage] = useState({ name: 'gallery' })
  const [refresh, setRefresh] = useState(false)
  const toast = useToast()

  useEffect(() => {
    MediaLibrary.requestPermissionsAsync()
      .then(({ status }) => {
        if (status !== 'granted') {
          Alert.alert('Permissions to read images were not granted')
        }
        MediaLibrary.getAssetsAsync({
          sortBy: 'modificationTime',
          first: 3 * 10,
          mediaType: 'photo'
        })
          .then(item => {
            const map = new Map()
            item.assets.forEach((e) => map.set(e.id, { id: e.id, uri: e.uri, filename: e.filename }))
            setImages(map)
          })
          .catch(e => console.error(e))
      })
      .catch(e => console.error(e))
  }, [refresh, currentPage])

  const deleteImages = (ids) => {
    MediaLibrary.deleteAssetsAsync(ids)
      .then(res => {
        toast.closeAll()
        if (res) {
          toast.show({
            description: 'Images deleted successfully'
          })
          setRefresh(!refresh)
        } else {
          toast.show({
            description: 'Failed to delete images'
          })
        }
      })
      .catch(e => console.error(e))
  }

  const deleteImage = (id) => {
    deleteImages([id])
    gallery()
  }

  const viewImage = (id) => {
    setPage({ name: 'view', imageId: id })
  }

  const gallery = () => {
    setPage({ name: 'gallery' })
  }

  const cameraPage = () => {
    setPage({ name: 'camera' })
  }

  const page = () => {
    switch (currentPage.name) {
      case 'gallery':
        return (
          <Gallery
            images={images ? Array.from(images.values()) : null}
            closeApp={closeApp}
            deleteImages={deleteImages}
            viewImage={viewImage}
            cameraPage={cameraPage}
          />
        )
      case 'view':
        return (
          <ImageView
            image={images.get(currentPage.imageId)}
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

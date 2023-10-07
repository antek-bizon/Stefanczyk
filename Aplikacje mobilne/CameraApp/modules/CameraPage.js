import { useEffect, useRef, useState } from 'react'
import AppBar from './Appbar'
import { Camera } from 'expo-camera'
import { Alert } from 'react-native'
import { AddIcon, Box, Button, Center, HStack, Heading, useToast } from 'native-base'
import { EvilIcons } from '@expo/vector-icons'
import * as MediaLibrary from 'expo-media-library'

const CameraPage = ({ goBack }) => {
  const [isCameraAvaiable, setAvaiable] = useState(false)
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
  const cameraRef = useRef(null)
  const toast = useToast()

  useEffect(() => {
    Camera.requestCameraPermissionsAsync()
      .then(v => {
        if (v.granted) {
          setAvaiable(v.granted)
        } else {
          Alert.alert('Permissions not granted',
            'To be able to take photos you need to allow it first.')
        }
      })
      .catch(e => console.error(e))
  }, [])

  const toogleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    )
  }

  const takeAPhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync()
        const { granted } = await MediaLibrary.requestPermissionsAsync()
        if (granted) {
          const asset = await MediaLibrary.createAssetAsync(photo.uri)
          toast.closeAll()
          toast.show({ description: 'Photo saved' })
          console.log(asset)
        } else {
          Alert.alert('Unable to save the photo', 'To be able to save photos you need to grant the permissions')
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  return (
    <>
      <AppBar title='Take a picture' backAction={goBack} />
      {isCameraAvaiable
        ? (
          <Box flex='1'>
            <Camera style={{ flex: 1, position: 'relative' }} ref={ref => { cameraRef.current = ref }} type={cameraType}>
              <HStack flex='1' position='absolute' bottom='0' w='100%' justifyContent='space-evenly' alignItems='center' p='10'>
                <Button borderRadius='full' opacity='0.8' size='60' colorScheme='secondary' onPress={() => toogleCameraType()}>
                  <EvilIcons name='redo' size={24} color='white' />
                </Button>
                <Button onPress={() => takeAPhoto()} borderRadius='full' opacity='0.8' size='70' bgColor='primary.300'>
                  <AddIcon color='black' />
                </Button>
              </HStack>
            </Camera>
          </Box>)
        : (
          <Center flex='1'>
            <Heading>Camera not available</Heading>
          </Center>)}
    </>
  )
}

export default CameraPage

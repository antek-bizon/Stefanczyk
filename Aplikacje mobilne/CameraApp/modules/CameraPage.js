import { useEffect, useRef, useState } from 'react'
import AppBar from './Appbar'
import { Camera } from 'expo-camera'
import { Alert, BackHandler } from 'react-native'
import Toast from 'react-native-simple-toast'
import { AddIcon, Box, Button, Center, HStack, Heading, Spinner } from 'native-base'
import { EvilIcons } from '@expo/vector-icons'
import * as MediaLibrary from 'expo-media-library'

const CameraPage = ({ goBack }) => {
  const [isCameraAvaiable, setAvaiable] = useState(null)
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
  const cameraRef = useRef(null)

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

    const handle = () => {
      goBack()
      return true
    }

    BackHandler.addEventListener('hardwareBackPress', handle)
    return () => BackHandler.removeEventListener('hardwareBackPress', handle)
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
        Toast.showWithGravity('Photo taken', Toast.SHORT, Toast.CENTER)
        const { granted } = await MediaLibrary.requestPermissionsAsync()
        if (granted) {
          await MediaLibrary.createAssetAsync(photo.uri)
          Toast.showWithGravity('Photo saved', Toast.SHORT, Toast.CENTER)
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
                <Button borderRadius='full' opacity='0.85' size='60' colorScheme='secondary' onPress={() => toogleCameraType()}>
                  <EvilIcons name='redo' size={35} color='white' />
                </Button>
                <Button onPress={takeAPhoto} borderRadius='full' size='70'>
                  <AddIcon size={30} color='lightText' />
                </Button>
              </HStack>
            </Camera>
          </Box>)
        : (
          <Center flex='1'>
            {isCameraAvaiable === false
              ? <Heading>Camera not available</Heading>
              : <Spinner size='xl' accessibilityLabel='Waiting for camera' />}
          </Center>)}
    </>
  )
}

export default CameraPage

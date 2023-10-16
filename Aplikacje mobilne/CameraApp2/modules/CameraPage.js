import { useEffect, useRef, useState } from 'react'
import { Camera } from 'expo-camera'
import { Alert, BackHandler, Platform, StyleSheet, View } from 'react-native'
import Toast from 'react-native-simple-toast'
import * as MediaLibrary from 'expo-media-library'
import { ActivityIndicator, IconButton, Text, useTheme } from 'react-native-paper'
import AppBar from './AppBar'
import CameraSettings from './CameraSettings'

export default function CameraPage ({ goBack }) {
  const [cameraInfo, setCameraInfo] = useState(null)
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
  const cameraRef = useRef(null)
  const theme = useTheme()
  const [isCameraSettings, setCameraSettings] = useState(false)
  console.log(isCameraSettings)

  useEffect(() => {
    Camera.requestCameraPermissionsAsync()
      .then(v => {
        if (v.granted) {
          setCameraInfo(true)
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

  const getCameraInfo = async () => {
    console.log('getCameraInfo') // Weird await bug
    if (cameraRef.current) {
      try {
        const ratios = (Platform.OS === 'android')
          ? await cameraRef.current.getSupportedRatiosAsync()
          : []
        console.log('ratios') // Weird await bug
        const allSizes = await Promise.all(
          ratios.map(async (r) => cameraRef.current.getAvailablePictureSizesAsync(r)
          ))

        const ratioSizesMap = new Map()
        ratios.forEach((r, i) => {
          ratioSizesMap.set(r, allSizes[i])
        })
        const flashMode = cameraRef.current.props.flashMode
        const whiteBalance = cameraRef.current.props.whiteBalance
        const ratio = cameraRef.current.props.ratio
        const sizes = ratioSizesMap.get(ratio)
        const size = (sizes.length > 0) ? sizes[sizes.length - 1] : null

        setCameraInfo({
          flashMode, whiteBalance, ratio, size, ratioSizesMap
        })
      } catch (e) {
        console.error(e)
      }
    }
  }

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

  const toggleCameraMenu = () => {
    if (typeof cameraInfo !== 'object') {
      Alert.alert('Failed', 'No camera info')
      setCameraSettings(false)
    }
    setCameraSettings(prev => !prev)
  }

  return (
    <>
      <AppBar title='Take a picture' onPress={goBack} />
      {cameraInfo
        ? (
          <View style={[styles.flex1, { position: 'relative' }]}>
            <View style={{ aspectRatio: 9 / 16 }}>
              <Camera
                ref={ref => { cameraRef.current = ref }}
                onCameraReady={getCameraInfo}
                style={styles.flex1}
                type={cameraType}
                ratio={cameraInfo.ratio}
                pictureSize={cameraInfo.size}
                flashMode={cameraInfo.flashMode}
                whiteBalance={cameraInfo.whiteBalance}
              />
            </View>

            <CameraSettings
              show={isCameraSettings}
              setShow={setCameraSettings}
              cameraInfo={cameraInfo}
              setCameraInfo={setCameraInfo}
            />

            <View style={styles.row}>
              <IconButton
                icon='restore'
                mode='contained'
                size={50}
                onPress={toogleCameraType}
                style={styles.button}
                iconColor={theme.colors.secondary}
              />
              <IconButton
                icon='camera'
                mode='contained'
                size={60}
                onPress={takeAPhoto}
                style={styles.button}
              />
              <IconButton
                icon='cog'
                mode='contained'
                size={50}
                onPress={toggleCameraMenu}
                style={styles.button}
                iconColor={theme.colors.secondary}
              />
            </View>
          </View>)
        : (
          <View style={[styles.flex1, styles.center]}>
            {cameraInfo === false
              ? <Text variant='displayMedium'>Camera not available</Text>
              : <ActivityIndicator size='large' />}
          </View>)}
    </>
  )
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  },

  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: '10',
    position: 'absolute',
    bottom: 0
  },

  button: {
    opacity: 0.85
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})

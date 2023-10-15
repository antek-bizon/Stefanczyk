import { FlashMode, WhiteBalance } from 'expo-camera'
import { Animated, ScrollView, StyleSheet } from 'react-native'
import Radio from './Radio'
import { useEffect, useRef } from 'react'

const width = 200

export default function CameraSettings ({
  show, cameraInfo, setCameraInfo
}) {
  const counter = useRef(0)
  const anim = useRef(new Animated.Value(-width))
  const toPos = (show) ? 0 : -width

  // Requires to renders to work properly
  if (counter.current < 2) {
    counter.current++
  } else {
    if (show) {
      anim.current = new Animated.Value(-width)
    } else {
      anim.current = new Animated.Value(0)
    }
  }

  useEffect(() => {
    Animated.spring(anim.current, {
      toValue: toPos,
      velocity: 1,
      tension: 0,
      friction: 10,
      useNativeDriver: true
    }).start()
  }, [anim.current])

  useEffect(() => {
    console.log(show)
  }, [show])

  const setFlashMode = (flashMode) => {
    setCameraInfo({ ...cameraInfo, flashMode })
  }

  const setWhiteBalance = (whiteBalance) => {
    setCameraInfo({ ...cameraInfo, whiteBalance })
  }

  const setRatio = (ratio) => {
    const sizes = cameraInfo.ratioSizesMap.get(ratio)
    const size = (sizes.length > 0) ? sizes[sizes.length - 1] : null
    setCameraInfo({ ...cameraInfo, ratio, size })
  }

  const setSize = (size) => {
    setCameraInfo({ ...cameraInfo, size })
  }

  return (
    <Animated.View style={[styles.main, {
      transform: [
        { translateX: anim.current }]
    }]}
    >
      <ScrollView>

        <Radio
          title='Flash mode'
          items={[FlashMode.auto, FlashMode.off, FlashMode.on, FlashMode.torch]}
          selected={cameraInfo.flashMode}
          onSelect={setFlashMode}
        />

        <Radio
          title='White balance'
          items={[
            WhiteBalance.auto, WhiteBalance.cloudy, WhiteBalance.fluorescent,
            WhiteBalance.incandescent, WhiteBalance.shadow, WhiteBalance.sunny
          ]}
          selected={cameraInfo.whiteBalance}
          onSelect={setWhiteBalance}
        />

        {cameraInfo.ratioSizesMap
          ? (
            <>
              <Radio
                title='Ratios'
                items={Array.from(cameraInfo.ratioSizesMap.keys())}
                selected={cameraInfo.ratio}
                onSelect={setRatio}
              />
              <Radio
                title='Sizes'
                items={cameraInfo.ratioSizesMap.get(cameraInfo.ratio)}
                selected={cameraInfo.size}
                onSelect={setSize}
              />
            </>)
          : null}
      </ScrollView>

    </Animated.View>
  )
}

const styles = StyleSheet.create({
  main: {
    position: 'absolute',
    left: 0,
    top: 0,
    width,
    height: '100%',
    backgroundColor: 'rgba(10, 20, 10, 0.8)',
    zIndex: 3
  }
})

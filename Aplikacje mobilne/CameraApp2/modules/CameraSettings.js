import { FlashMode } from 'expo-camera'
import { Animated, StyleSheet } from 'react-native'
import Radio from './Radio'
import { useEffect, useRef } from 'react'

const width = 150

export default function CameraSettings ({
  show, flashMode, setFlashMode, whiteBalance,
  setWhiteBalance, ratios, sizes
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

  return (
    <Animated.View style={[styles.main, {
      transform: [
        { translateX: anim.current }]
    }]}
    >
      <Radio
        items={[FlashMode.auto, FlashMode.off, FlashMode.on, FlashMode.torch]}
      />

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
    backgroundColor: 'rgba(10, 20, 10, 0.8)'
  }
})

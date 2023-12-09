import { useState } from 'react'
import { StyleSheet, Vibration, View } from 'react-native'
import { FAB, Text, TouchableRipple, useTheme } from 'react-native-paper'
import ClockElement from './ClockElement'
import { addZeros } from './utils'

function shortVibration () {
  Vibration.vibrate(50)
}

export default function AddAlarmPage ({ navigation }) {
  const theme = useTheme()
  const [isHours, setClockState] = useState(true)
  const [time, setTime] = useState({ hours: 0, minutes: 0 })

  const fab = (
    // eslint-disable-next-line
    <FAB
      icon='plus' style={styles.fab}
      onPress={() => navigation.navigate('Main page', {
        toAdd: { time }
      })}
    />
  )

  const clockElements = () => {
    const elements = []
    const angleDelta = 2 * Math.PI / 12
    const clocks = (isHours)
      ? [{ radius: 140, size: 50 }, { radius: 85, size: 40 }]
      : [{ radius: 140, size: 50 }]
    let j = 0
    clocks.forEach(e => {
      const { radius, size } = e
      for (let i = 1; i <= 12; i++) {
        const value = (isHours) ? j : j * 5
        const left = radius * Math.cos(angleDelta * i - Math.PI / 1.5)
        const top = radius * Math.sin(angleDelta * i - Math.PI / 1.5)

        const onPress = () => {
          shortVibration()
          if (isHours) {
            setTime(prev => { return { hours: value, minutes: prev.minutes } })
          } else {
            setTime(prev => {
              const delta = prev.minutes - value
              const newValue = (delta >= 0 && delta < 4) ? prev.minutes + 1 : value
              return { hours: prev.hours, minutes: newValue }
            })
          }
        }

        elements.push(
          <ClockElement
            key={value}
            text={value.toString()}
            left={left}
            top={top}
            size={size}
            innerRing={j >= 12}
            onPress={onPress}
          />)
        j++
      }
    })

    return elements
  }

  return (
    <>
      <View style={[styles.main, { backgroundColor: theme.colors.secondary }]}>
        <View style={styles.time}>
          <View style={styles.touchableContainer}>
            <TouchableRipple
              style={styles.touchable}
              onPress={() => setClockState(true)}
              rippleColor={theme.colors.onSecondary}
            >
              <Text
                style={{ color: theme.colors.onSecondary }}
                variant='displayLarge'
              >{addZeros(time.hours)}
              </Text>
            </TouchableRipple>
          </View>
          <Text
            style={{ color: theme.colors.onSecondary }}
            variant='displayLarge'
          >:
          </Text>
          <View style={styles.touchableContainer}>
            <TouchableRipple
              style={styles.touchable}
              onPress={() => setClockState(false)}
              rippleColor={theme.colors.onSecondary}
            >
              <Text
                style={[styles.text, { color: theme.colors.onSecondary }]}
                variant='displayLarge'
              >{addZeros(time.minutes)}
              </Text>
            </TouchableRipple>
          </View>
        </View>
        <View style={styles.clock}>
          {clockElements()}
        </View>
      </View>
      <View style={styles.centerAbsolute}>
        <View style={styles.centerRelative}>
          {fab}
        </View>
      </View>

    </>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1
  },
  touchableContainer: {
    borderRadius: 30,
    overflow: 'hidden'
  },
  touchable: {
    padding: 10
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: 5
  },
  centerAbsolute: { position: 'absolute', height: '100%', width: '100%' },
  centerRelative: {
    position: 'relative',
    bottom: 0,
    left: '50%',
    height: '100%'
  },
  fab: {
    position: 'absolute',
    left: -30,
    bottom: 0,
    marginVertical: 20
  },
  clock: {
    position: 'relative',
    flex: 3,
    left: '50%',
    top: 160
  }
})

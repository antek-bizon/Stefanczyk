import { FlashList } from '@shopify/flash-list'
import { useEffect, useRef, useState } from 'react'
import { StyleSheet, Vibration, View } from 'react-native'
import { ActivityIndicator, FAB, useTheme } from 'react-native-paper'
import * as Database from './Database'
import Alarm from './Alarm'
import { addZeros } from './utils'
import { Audio } from 'expo-av'

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = 60 * MINUTE

function getTime (alarm, now) {
  const [hours, minutes] = alarm.time.split(':').map(e => parseInt(e))
  return -((now.getHours() - hours) * HOUR + (now.getMinutes() - minutes) * MINUTE + now.getSeconds() * SECOND + now.getMilliseconds())
}

function clearAlarmTimeouts (alarms) {
  alarms.forEach(e => {
    // console.log(e.timeouts)
    e.timeouts?.forEach(t => clearTimeout(t))
  })
}

export default function MainPage ({ navigation, route }) {
  const theme = useTheme()
  const [alarms, alarmsHandle] = useState([])
  const [collapsed, setCollapsed] = useState(new Set())
  const [isReady, setReady] = useState(false)
  const [sound, setSound] = useState()
  const wasSoundPlaying = useRef(false)
  const isSoundPlaying = alarms.reduce((acc, val) => acc || (!!val.isOn && !!val.sound), false)
  const wasPhoneVibrating = useRef(false)
  const isPhoneVibrating = alarms.reduce((acc, val) => acc || (!!val.isOn && !!val.vibrations), false)

  if (wasSoundPlaying.current !== isSoundPlaying) {
    if (isSoundPlaying) {
      playSound()
    } else {
      sound.pauseAsync()
    }
    wasSoundPlaying.current = isSoundPlaying
  }

  if (wasPhoneVibrating.current !== isPhoneVibrating) {
    if (isPhoneVibrating) {
      Vibration.vibrate([100, 100], true)
    } else {
      Vibration.cancel()
    }
    wasPhoneVibrating.current = isPhoneVibrating
  }

  useEffect(() => {
    getAlarms()
    return () => {
      Vibration.cancel()
      dropTimeouts()
    }
  }, [])

  useEffect(() => {
    if (route.params?.toAdd) {
      addAlarm(route.params?.toAdd.time)
      route.params.toAdd = null
    }
  }, [route.params])

  useEffect(() => {
    return sound
      ? () => sound.unloadAsync()
      : undefined
  }, [sound])

  const dropTimeouts = () => clearAlarmTimeouts(alarms)

  async function playSound () {
    const { sound } = await Audio.Sound.createAsync(require('../assets/alarm-sound.mp3'))
    setSound(sound)
    sound.playAsync()
  }

  const alarmTimeouts = (time, id) => {
    if (time > -MINUTE) {
      const start = setTimeout(() => {
        // console.log('alarm')
        alarmsHandle(prev => {
          const alarmToUpdate = prev.find(a => a.id === id)
          if (alarmToUpdate) {
            alarmToUpdate.isOn = true
          }
          Database.update(alarmToUpdate)
          return [...prev]
        })
      }, time)
      const end = setTimeout(() => {
        // console.log('stop alarm')
        alarmsHandle(prev => {
          const alarmToUpdate = prev.find(a => a.id === id)
          if (alarmToUpdate) {
            alarmToUpdate.isOn = false
            Database.update(alarmToUpdate)
          }
          return [...prev]
        })
      }, MINUTE + time)
      return [start, end]
    }
    return [0]
  }

  const createAlarmWithTimeouts = (prevAlarms, newAlarms) => {
    const now = new Date()
    clearAlarmTimeouts(prevAlarms)
    newAlarms.forEach(alarm => {
      if (alarm.selectedDays.find(e => e === now.getDay())) {
        const time = getTime(alarm, now)
        alarm.isOn = !(time > 0 || time < -60 * 1000)
        alarm.timeouts = alarmTimeouts(time, alarm.id)
      }
    })
    return newAlarms
  }

  const setAlarms = (newAlarms) => {
    alarmsHandle(prev => createAlarmWithTimeouts(prev, newAlarms))
  }

  const getAlarms = () => {
    setReady(false)
    Database.getAll()
      .then((items) => {
        const rawAlarms = items.rows._array.map(e => {
          const data = JSON.parse(e.alarm)
          return {
            ...data,
            id: e.id
          }
        })
        setReady(true)
        setAlarms(rawAlarms)
      })
      .catch((e) => console.error(e))
  }

  const addAlarm = (time) => {
    const newAlarm = {
      time: `${addZeros(time.hours)}:${addZeros(time.minutes)}`,
      isOn: false,
      vibrations: false,
      sound: false,
      selectedDays: []
    }
    Database.add(JSON.stringify(newAlarm))
    getAlarms()
  }

  const updateAlarm = (item) => {
    setAlarms([...alarms])
    Database.update(item)
  }

  const removeAlarm = (id) => {
    setAlarms(alarms.filter(e => {
      if (e.id === id) {
        clearAlarmTimeouts([e])
      }
      return e.id !== id
    }))
    Database.remove(id)
  }

  const fab = (
    // eslint-disable-next-line
    <FAB
      icon='plus' style={styles.fab}
      onPress={() => navigation.navigate('Add alarm page')}
    />
  )

  const collapse = (id) => {
    if (collapsed.has(id)) {
      setCollapsed(prev => {
        prev.delete(id)
        return new Set(prev)
      })
    } else {
      setCollapsed(prev => new Set(prev.add(id)))
    }
  }

  const renderItem = ({ item, index, extraData }) => {
    return (
      <Alarm
        key={index} item={item}
        isCollapsed={!extraData.collapsed.has(item.id)}
        collapse={collapse}
        updateAlarm={updateAlarm} removeAlarm={removeAlarm}
      />
    )
  }

  return (
    <View style={[styles.main, { backgroundColor: theme.colors.secondary }]}>
      {isReady
        ? null
        : (
          <View style={styles.wait}>
            <ActivityIndicator color={theme.colors.inversePrimary} size='large' />
          </View>)}

      <FlashList
        renderItem={renderItem}
        data={alarms}
        estimatedItemSize={170}
        extraData={{ collapsed }}
        numColumns={1}
        ListFooterComponentStyle={{ paddingBottom: 80 }}
      />
      {fab}
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1
  },
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 25
  },
  wait: {
    backgroundColor: '#32283280',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

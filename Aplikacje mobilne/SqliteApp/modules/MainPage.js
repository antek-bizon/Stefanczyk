import { FlashList } from '@shopify/flash-list'
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ActivityIndicator, FAB, useTheme } from 'react-native-paper'
import * as Database from './Database'
import Alarm from './Alarm'

export default function MainPage ({ navigation, route }) {
  const theme = useTheme()
  const [alarms, setAlarms] = useState([])
  const [collapsed, setCollapsed] = useState(new Set())
  const [isReady, setReady] = useState(false)

  useEffect(() => {
    if (route.params?.toAdd) {
      addAlarm()
      route.params.toAdd = null
    }
  }, [route.params])

  useEffect(() => {
    getAlarms()
  }, [])

  const getAlarms = () => {
    setReady(false)
    Database.getAll()
      .then((items) => {
        const alarms = items.rows._array.map(e => {
          const data = JSON.parse(e.alarm)
          return {
            ...data,
            id: e.id
          }
        })
        setReady(true)
        setAlarms(alarms)
      })
      .catch((e) => console.error(e))
  }

  const addAlarm = () => {
    const newAlarm = {
      time: '00:00',
      isSelected: false,
      selectedDays: []
    }
    Database.add(JSON.stringify(newAlarm))
    getAlarms()
  }

  const updateAlarm = (item) => {
    setAlarms([...alarms])
    const { id, ...rest } = item
    Database.update(id, JSON.stringify(rest))
    // getAlarms()
  }

  const removeAlarm = (id) => {
    setAlarms(alarms.filter(e => e.id !== id))
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

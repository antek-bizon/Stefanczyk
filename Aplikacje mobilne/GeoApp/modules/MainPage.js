import { useEffect, useState, useMemo, useCallback } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ActivityIndicator, Appbar, Button, Divider, List, Snackbar, Switch, useTheme } from 'react-native-paper'
import { FlashList } from '@shopify/flash-list'
import MapPage from './MapPage'

const MainPage = ({ closeApp }) => {
  const [loading, setLoading] = useState(0)
  const [locations, updateLocations] = useState([])
  const [isPermited, setPermission] = useState(false)
  const selected = useMemo(() => {
    const selLoc = locations.filter(e => e.selected)
    const areAllSel = locations.length !== 0 && selLoc.length === locations.length
    return {
      selLoc,
      areAllSel
    }
  }, [locations])

  const [currentPage, setPage] = useState('pos')
  const mapPage = () => setPage('map')
  const posPage = () => setPage('pos')
  const theme = useTheme()

  useEffect(() => {
    AsyncStorage.getAllKeys()
      .then(keys => {
        AsyncStorage.multiGet(keys)
          .then(pairs => updateLocations(pairs.map(pair => JSON.parse(pair[1]))))
          .catch(err => console.error(err))
      })
      .catch(err => console.error(err))

    Location.requestForegroundPermissionsAsync()
      .then(perm => setPermission(perm.granted === true))
      .catch(err => console.error(err))
  }, [])

  const getLocation = () => {
    const promise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Getting current position took to long. Try again.'))
      }, 5000)
      Location.getCurrentPositionAsync({
        mayShowUserSettingsDialog: true
      })
        .then((pos) => {
          clearTimeout(timeout)
          const item = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            timestamp: pos.timestamp,
            selected: false
          }
          // locations.push(item)
          updateLocations([...locations, item])
          const key = pos.timestamp.toString() + Math.round(Math.random() * 100).toString()
          AsyncStorage.setItem(key, JSON.stringify(item))
            .then(_ => resolve())
            .catch(err => console.error(err))
        })
        .catch(e => console.error(e))
    })

    promise
      .then(_ => setLoading(2))
      .catch(e => {
        Alert.alert('Error', e.message)
        setLoading(0)
      })
    setLoading(1)
  }

  const deleteLocations = () => {
    updateLocations([])
    AsyncStorage.getAllKeys()
      .then(keys => AsyncStorage.multiRemove(keys).catch(err => console.error(err)))
      .catch(err => console.error(err))
  }

  const onValueChange = useCallback((index) => {
    locations[index].selected = !locations[index].selected
    updateLocations([...locations])
  }, [locations])

  const renderItem = ({ item, index }) => {
    return (
      <List.Item
        key={index}
        left={props => <List.Icon {...props} icon='longitude' />}
        right={props => (
          <Switch
            {...props}
            value={item.selected} onValueChange={() => onValueChange(index)}
          />)}
        title={`Timestamp: ${item.timestamp}`}
        description={`latitude: ${item.latitude}\nlongitude: ${item.longitude}`}
      />
    )
  }

  const page = () => {
    switch (currentPage) {
      case 'pos':
        return (
          <>
            <Appbar.Header>
              <Appbar.BackAction onPress={closeApp} />
              <Appbar.Content title='Save position' />
            </Appbar.Header>
            <Divider />
            <View>
              <View style={styles.buttons}>
                <Button disabled={!isPermited} onPress={getLocation} mode='contained'>Get position</Button>
                <Button
                  onPress={deleteLocations} mode='contained' buttonColor={theme.colors.error}
                >Delete all
                </Button>
              </View>
              <View style={styles.buttons}>
                <Button
                  disabled={selected.selLoc.length === 0}
                  onPress={mapPage}
                  mode='contained-tonal'
                >Go to a map
                </Button>
                <Switch
                  style={{ position: 'absolute', right: 25, top: 5 }}
                  value={selected.areAllSel} onValueChange={() => {
                    updateLocations(locations.map((e) => {
                      e.selected = !selected.areAllSel
                      return e
                    }))
                  }}
                />
              </View>
              <Divider />
            </View>
            <FlashList
              data={locations}
              renderItem={renderItem}
              numColumns={1}
              estimatedItemSize={85}
              extraData={locations}
            />
            <Snackbar
              visible={loading === 2}
              onDismiss={() => setLoading(0)}
              action={{ label: 'OK' }}
            >
              Position saved
            </Snackbar>
            {loading === 1 &&
              <View style={[styles.indicator, { backgroundColor: theme.colors.backdrop }]}>
                <ActivityIndicator size='large' />
              </View>}
          </>
        )
      case 'map':
        return (
          <MapPage selectedLocations={selected.selLoc} goBack={posPage} />
        )
      default:
        return <></>
    }
  }

  return (
    <View style={styles.main}>{page()}</View>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1
  },

  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10
  },

  indicator: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  }
})

export default MainPage

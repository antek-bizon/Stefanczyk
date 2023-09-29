import { StyleSheet, View } from 'react-native'
import { ActivityIndicator, Appbar, Button, Divider, List, Snackbar, Switch, useTheme } from 'react-native-paper'
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'

const MainPage = ({ startingPage }) => {
  const [locations, updateLocations] = useState([])
  const theme = useTheme()
  const [isPermited, setPermission] = useState(false)
  const [loading, setLoading] = useState(0)
  const areAllSelected = typeof locations.find((e) => !e.selected) === 'undefined'
  const selectedLocations = locations.filter(e => e.selected)
  const [mapView, setMapView] = useState(false)

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
    setLoading(1)
    Location.getCurrentPositionAsync({})
      .then((pos) => {
        const item = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          timestamp: pos.timestamp,
          selected: false
        }
        locations.push(item)
        updateLocations(locations)
        const key = pos.timestamp.toString() + Math.round(Math.random() * 100).toString()
        AsyncStorage.setItem(key, JSON.stringify(item))
          .then(_ => setLoading(2))
          .catch(err => console.error(err))
      })
  }

  const deleteLocations = () => {
    updateLocations([])
    AsyncStorage.getAllKeys()
      .then(keys => AsyncStorage.multiRemove(keys).catch(err => console.error(err)))
      .catch(err => console.error(err))
  }

  return (
    <>
      <View style={styles.main}>
        <Appbar.Header>
          {!mapView
            ? (
              <>
                <Appbar.BackAction onPress={() => { startingPage() }} />
                <Appbar.Content title='Save position' />
              </>)
            : (
              <>
                <Appbar.BackAction onPress={() => { setMapView(false) }} />
                <Appbar.Content title='Locations on map' />
              </>)}

        </Appbar.Header>
        <Divider />
        {!mapView
          ? (
            <>
              <View>
                <View style={styles.buttons}>
                  <Button disabled={!isPermited} onPress={() => getLocation()} mode='contained'>Get position</Button>
                  <Button
                    onPress={() => deleteLocations()} mode='contained' buttonColor={theme.colors.error}
                  >Delete all
                  </Button>
                </View>
                <View style={styles.buttons}>
                  <Button
                    disabled={selectedLocations.length === 0}
                    onPress={() => setMapView(true)}
                    mode='contained-tonal'
                  >Go to a map
                  </Button>
                  <Switch
                    style={{ position: 'absolute', right: 25, top: 5 }}
                    value={areAllSelected} onValueChange={() => {
                      updateLocations(locations.map((e) => {
                        e.selected = !areAllSelected
                        return e
                      }))
                    }}
                  />
                </View>
                <Divider />
              </View>
              <List.Section>
                {
                  locations.map((e, i) => (
                    <List.Item
                      key={i}
                      left={props => <List.Icon {...props} icon='longitude' />}
                      right={props => (
                        <Switch
                          {...props}
                          value={e.selected} onValueChange={() => {
                            locations[i].selected = !locations[i].selected
                            updateLocations([...locations])
                          }}
                        />)}
                      title={`Timestamp: ${e.timestamp}`}
                      description={`latitude: ${e.latitude}\nlongitude: ${e.longitude}`}
                    />
                  ))
                }
              </List.Section>
              <Snackbar
                visible={loading === 2}
                onDismiss={() => setLoading(0)}
                action={{ label: 'OK' }}
              >
                Position saved
              </Snackbar>
            </>)
          : (
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: selectedLocations[0]?.latitude ?? 50,
                longitude: selectedLocations[0]?.longitude ?? 20,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
              }}
            >
              {selectedLocations.length > 0 &&
                selectedLocations.map((e, i) => (
                  <Marker
                    key={i}
                    coordinate={{ latitude: e.latitude, longitude: e.longitude }}
                    title={`${e.timestamp}`}
                    description={`${e.latitude}, ${e.longitude}`}
                  />))}
            </MapView>)}
      </View>
      {loading === 1 &&
        <View style={[styles.indicator, { backgroundColor: theme.colors.backdrop }]}>
          <ActivityIndicator size='large' />
        </View>}
    </>
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

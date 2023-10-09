import MapView, { Marker } from 'react-native-maps'
import { Appbar } from 'react-native-paper'

const MapPage = ({ selectedLocations, goBack }) => {
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title='Locations on map' />
      </Appbar.Header>
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
      </MapView>
    </>
  )
}

export default MapPage

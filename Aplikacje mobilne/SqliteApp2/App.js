import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'react-native'
import StartingPage from './modules/StartingPage'
import { PaperProvider, configureFonts, MD3LightTheme, Appbar } from 'react-native-paper'
import MainPage from './modules/MainPage'
import AddAlarmPage from './modules/AddAlarmPage'
import { useFonts } from 'expo-font'
import { getHeaderTitle } from '@react-navigation/elements'
import { useEffect } from 'react'
import * as Database from './modules/Database'

const Stack = createNativeStackNavigator()

const baseFont = configureFonts({
  config: {
    fontFamily: 'Quicksand'
  }
})

const theme = {
  ...MD3LightTheme,
  fonts: baseFont
}

export default function App () {
  const [fontLoaded] = useFonts({
    Quicksand: require('./assets/fonts/static/Quicksand-Regular.ttf'),
    'Quicksand-SemiBold': require('./assets/fonts/static/Quicksand-SemiBold.ttf')
  })

  useEffect(() => {
    // Database.clear()
    Database.createTable()
  }, [])

  if (!fontLoaded) {
    return null
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar />
        <Stack.Navigator
          screenOptions={{
            header: (props) => <MyAppbar {...props} />
          }}
        >
          <Stack.Screen
            name='Starting page'
            title='SqliteApp'
            options={{ headerShown: false }}
            component={StartingPage}
          />
          <Stack.Screen
            name='Main page'
            title='Alarm list'
            component={MainPage}
          />
          <Stack.Screen
            name='Add alarm page'
            title='Add alarm'
            component={AddAlarmPage}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>

  )
}

function MyAppbar ({ navigation, route, options, back }) {
  const title = getHeaderTitle(options, route.name)

  return (
    <Appbar.Header>
      {back
        ? <Appbar.BackAction onPress={navigation.goBack} /> // eslint-disable-line
        : null}
      <Appbar.Content titleStyle={{ fontFamily: 'Quicksand-SemiBold' }} title={title} />
    </Appbar.Header>
  )
}

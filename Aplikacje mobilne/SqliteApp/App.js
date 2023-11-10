import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'react-native'
import StartingPage from './modules/StartingPage'
import { PaperProvider } from 'react-native-paper'
import MainPage from './modules/MainPage'
import AddAlarmPage from './modules/AddAlarmPage'

const Stack = createNativeStackNavigator()

export default function App () {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar />
        <Stack.Navigator>
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

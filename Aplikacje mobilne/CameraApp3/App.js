import { useState } from 'react'
import {
  MD3LightTheme as DefaultTheme, PaperProvider
} from 'react-native-paper'
import { StatusBar } from 'react-native'
import StartingPage from './modules/StartingPage'
import MainPage from './modules/MainPage'
import { colors } from './modules/Theme'

const theme = {
  ...DefaultTheme,
  colors
}

export default function App () {
  const [opened, setOpened] = useState(false)

  return (
    <PaperProvider theme={theme}>
      <StatusBar />
      {opened ? <MainPage closeApp={setOpened} /> : <StartingPage openApp={setOpened} />}
    </PaperProvider>
  )
}

import React, { useState } from 'react'
import { StatusBar } from 'react-native'
import { NativeBaseProvider } from 'native-base'
import StartingPage from './modules/StartingPage'
import MainPage from './modules/MainPage'

export default function App () {
  const [opened, setOpened] = useState(false)

  return (
    <NativeBaseProvider>
      <StatusBar />
      {opened ? <MainPage closeApp={setOpened} /> : <StartingPage openApp={setOpened} />}
    </NativeBaseProvider>
  )
}

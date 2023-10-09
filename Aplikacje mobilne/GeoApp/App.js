import { useState } from 'react'
import { StatusBar } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import StartingPage from './modules/StartingPage'
import MainPage from './modules/MainPage'

export default function App () {
  const [state, setState] = useState('start')

  const startingPage = () => { setState('start') }
  const mainPage = () => { setState('main') }

  const page = (state) => {
    switch (state) {
      case 'start':
        return <StartingPage mainPage={mainPage} />
      case 'main':
        return <MainPage closeApp={startingPage} />
      default:
        return <></>
    }
  }

  return (
    <PaperProvider>
      <StatusBar />
      {page(state)}
    </PaperProvider>
  )
}

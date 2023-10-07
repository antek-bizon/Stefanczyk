import React, { useState } from "react";
import { StatusBar } from 'react-native'
import { NativeBaseProvider, Box } from "native-base";
import StartingPage from "./modules/StartingPage";
import MainPage from "./modules/MainPage";

export default function App() {
  const [state, setState] = useState('start')
  const page = () => {
    switch (state) {
      case 'start':
        return <StartingPage setState={setState} />
      case 'main':
        return <MainPage setState={setState} />
      default:
        return <></>
    }
  }

  return (
    <NativeBaseProvider>
      <StatusBar/>
      {page()}
    </NativeBaseProvider>
  );
}

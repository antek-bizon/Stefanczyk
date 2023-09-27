import { StatusBar, Text } from 'react-native'
import * as eva from '@eva-design/eva'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import RegisterPage from './modules/RegisterPage'
import { useState } from 'react'
import AdminPage from './modules/AdminPage'
import DetailsPage from './modules/DetailsPage'

const App = () => {
  const [state, changeState] = useState({ name: 'register' })
  // const [users, setUsers] = useState(new Map())

  const registerPage = () => {
    changeState({ name: 'register' })
  }

  const adminPage = () => {
    changeState({ name: 'admin' })
  }

  const detailsPage = (user) => {
    changeState({ name: 'details', user })
  }

  switch (state.name) {
    case 'register':
      return (
        <RegisterPage adminPage={adminPage} />
      )
    case 'admin':
      return (
        <AdminPage
          prevPage={registerPage}
          detailsPage={detailsPage}
        />
      )
    case 'details':
      return (
        <DetailsPage user={state.user} prevPage={adminPage} />
      )
    default:
      return (
        <Text>No state {state}</Text>
      )
  }
}

export default () => (
  <>
    <StatusBar />
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <App />
    </ApplicationProvider>
  </>
)

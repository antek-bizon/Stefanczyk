import { Alert, StatusBar, Text } from 'react-native'
import * as eva from '@eva-design/eva'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import RegisterPage from './modules/RegisterPage'
import { useState } from 'react'
import AdminPage from './modules/AdminPage'
import DetailsPage from './modules/DetailsPage'

const App = () => {
  const [state, changeState] = useState({ name: 'register' })
  const [users, setUsers] = useState(new Map())

  const registerPage = () => {
    changeState({ name: 'register' })
  }

  const adminPage = () => {
    changeState({ name: 'admin' })
  }

  const detailsPage = (user) => {
    changeState({ name: 'details', user })
  }

  const registerUser = (name, password) => {
    if (users.has(name)) {
      Alert.alert('User already exists', name)
    } else {
      setUsers(new Map(users.set(name, { login: name, password, date: Date.now() })))
      adminPage()
    }
  }

  const deleteUser = (name) => {
    if (users.has(name)) {
      users.delete(name)
      setUsers(new Map(users))
    }
  }

  switch (state.name) {
    case 'register':
      return (
        <RegisterPage registerUser={registerUser} />
      )
    case 'admin':
      return (
        <AdminPage
          users={users}
          prevPage={registerPage}
          detailsPage={detailsPage}
          deleteUser={deleteUser}
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

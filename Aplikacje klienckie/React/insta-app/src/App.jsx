import { useState } from 'react'
import UserValidation from './user/UserValidation'
import { ChakraProvider, Box } from '@chakra-ui/react'
import MainPage from './MainPage'

function App () {
  let sessionData = window.sessionStorage.getItem('sesionData')
  if (sessionData) {
    sessionData = JSON.parse(sessionData)
  }
  const [clientData, setClientData] = useState(sessionData)
  const isClientToken = clientData && clientData.token !== ''

  const setData = (data) => {
    setClientData(data)
    window.sessionStorage.setItem('sesionData', JSON.stringify(data))
  }

  const logout = () => {
    window.sessionStorage.removeItem('sesionData')
    setClientData('')
  }

  return (
    <ChakraProvider>
      <Box width='100vw' height='100vh' bgImage='url(/background.gif)' bgSize='cover' bgPosition='center' bgRepeat='no-repeat'>
        {
          !isClientToken
            ? <UserValidation setData={setData} />
            : <MainPage clientData={clientData} logout={logout} />
        }
      </Box>
    </ChakraProvider>
  )
}

export default App

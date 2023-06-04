import { useCookies } from 'react-cookie'
import { useState } from 'react'
import UserValidation from './user/UserValidation'
import { ChakraProvider, Box } from '@chakra-ui/react'
import MainPage from './MainPage'

function App () {
  let sessionData = window.sessionStorage.getItem('sesionData')
  if (sessionData) {
    sessionData = JSON.parse(sessionData)
  }
  const [cookies, setCookie, removeCookie] = useCookies(['token'])
  const [clientData, setClientData] = useState(sessionData)
  const isClientToken = !!(cookies.token)

  const setData = (data) => {
    setClientData(data)
    setCookie('token', data.token, { maxAge: 60 })
    setCookie('example', 'example', { maxAge: 60 })
  }

  const logout = () => {
    removeCookie('token', '')
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

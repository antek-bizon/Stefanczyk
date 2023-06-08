import { useCookies } from 'react-cookie'
import UserValidation from './user/UserValidation'
import { ChakraProvider, Box, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, HStack, Flex } from '@chakra-ui/react'
import MainPage from './mainPages/MainPage'
import { useState } from 'react'

function App () {
  const [cookies, setCookie, removeCookie] = useCookies(['token'])
  const [cookiesExpired, setCookiesExpired] = useState(false)
  const isClientToken = !!(cookies.token)

  const setData = (data) => {
    const maxAge = 60 * 60
    setCookie('token', data.token, { maxAge })
    setTimeout(() => {
      logout()
      setCookiesExpired(true)
    }, maxAge * 1000)
  }

  const logout = () => {
    removeCookie('token', '')
  }

  return (
    <ChakraProvider>
      <Flex width='100vw' height='max-content' minH='100vh' bgImage='url(/background.gif)' bgAttachment='fixed' bgSize='cover' bgPosition='center' bgRepeat='no-repeat'>
        {
          cookiesExpired &&
          (
            <HStack w='100%' position='absolute' top='5%' left='0%' justify='center'>
              <Alert status='warning' width='fit-content' zIndex='calc(var(--chakra-zIndices-modal) + 1)' gap='10px'>
                <AlertIcon />
                <Box>
                  <AlertTitle>Token expired</AlertTitle>
                  <AlertDescription>Please login again.</AlertDescription>
                </Box>
                <CloseButton onClick={() => setCookiesExpired('')} />
              </Alert>)
            </HStack>
          )
        }
        {
          !isClientToken
            ? <UserValidation setData={setData} />
            : <MainPage cookies={cookies} logout={logout} />
        }
      </Flex>
    </ChakraProvider>
  )
}

export default App

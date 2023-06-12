import { useCookies } from 'react-cookie'
import UserValidation from './user/UserValidation'
import { ChakraProvider, Flex, useToast } from '@chakra-ui/react'
import MainPage from './mainPages/MainPage'

function App () {
  const [cookies, setCookie, removeCookie] = useCookies(['token'])
  const cookiesExpiredToast = useToast()
  const isClientToken = !!(cookies.token)
  const cookieToast = useToast()

  const setData = (data) => {
    const maxAge = 60 * 60
    setCookie('token', data.token, { maxAge, sameSite: 'strict' })
    cookieToast({
      title: 'This website is using cookies.',
      description: 'We use cookies to improve your experience. By continuing to browse the site, you agree to our use of cookies.',
      status: 'info',
      duration: 4000,
      isClosable: true
    })
    setTimeout(() => {
      logout(true)
    }, maxAge * 1000)
  }

  const logout = (tokenExpired = false) => {
    removeCookie('token', '')
    if (tokenExpired) {
      cookiesExpiredToast({
        title: 'Token expired',
        description: 'Your token has expired. Please login again.',
        status: 'warning',
        duration: 6000,
        isClosable: true
      })
    }
  }

  return (
    <ChakraProvider>
      <Flex width='100vw' height='max-content' minH='100vh' bgImage='url(/background.gif)' bgAttachment='fixed' bgSize='cover' bgPosition='center' bgRepeat='no-repeat'>
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

import { Button, FormControl, HStack, Input, Box, Alert, AlertIcon, AlertDescription, AlertTitle, CloseButton } from '@chakra-ui/react'
import { useState } from 'react'

export default function Login ({ setData }) {
  const [email, changeEmail] = useState('')
  const [password, changePassword] = useState('')
  const [error, changeError] = useState('')

  const isError = error !== ''

  const loginUser = async (e) => {
    e.preventDefault()
    const body = JSON.stringify({
      email,
      password
    })

    try {
      const response = await fetch('http://localhost:3001/api/user/login', {
        method: 'POST',
        body,
        headers: {
          // 'Content-Type': 'application/json'
          'Content-Type': 'text/plain'
        }
      })
      console.log(response)
      const result = await response.json()
      if (result.err || !result.data) {
        console.error('Login failed:', result.msg)
        changeError(result.msg)
        return
      }

      setData(result.data)
    } catch (e) {
      console.error(e)
      changeError(e.message)
    }
  }

  return (
    <Box my={4}>
      {
        isError && (
          <HStack w='100%' position='absolute' top='5%' left='0%' justify='center'>
            <Alert status='error' width='fit-content' zIndex='calc(var(--chakra-zIndices-modal) + 1)' gap='10px'>
              <AlertIcon />
              <Box>
                <AlertTitle>Login failed</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Box>
              <CloseButton onClick={() => changeError('')} />
            </Alert>
          </HStack>
        )
      }
      <form onSubmit={(e) => loginUser(e)} className='column equal-height'>
        <FormControl>
          <Input type='text' placeholder='E-mail' required onChange={(e) => changeEmail(e.target.value)} />
        </FormControl>
        <FormControl>
          <Input type='password' placeholder='Password' required onChange={(e) => changePassword(e.target.value)} />
        </FormControl>
        <Button type='submit' mt={4} colorScheme='teal' variant='solid' size='md'>Login</Button>
      </form>
    </Box>

  )
}

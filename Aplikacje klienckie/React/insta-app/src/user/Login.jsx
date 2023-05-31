import { Button, FormControl, FormLabel, Input, Box, Alert, AlertIcon, AlertDescription, AlertTitle, CloseButton } from '@chakra-ui/react'
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

      const result = await response.json()
      if (result.err || !result.data) {
        console.error('Login failed:', result.msg)
        changeError(result.msg)
        return
      }

      setData(result.data)
    } catch (e) {
      console.error(e)
      changeError(e)
    }
  }

  return (
    <Box my={4}>
      {
        isError && <Alert status='error' position='absolute' top='5%' left='calc(50% - 120px)' width='fit-content' zIndex='1' gap='10px'>
          <AlertIcon />
          <Box>
            <AlertTitle>Login failed</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Box>
          <CloseButton onClick={() => changeError('')} />
        </Alert>
      }
      <form onSubmit={(e) => loginUser(e)} className='column equal-height'>
        <FormControl>
          <FormLabel>E-mail</FormLabel>
          <Input type='text' placeholder='E-mail' required onChange={(e) => changeEmail(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type='password' placeholder='Password' required onChange={(e) => changePassword(e.target.value)} />
        </FormControl>
        <Button type='submit' mt={4} colorScheme='teal' variant='solid' size='md'>Login</Button>
      </form>
    </Box>

  )
}
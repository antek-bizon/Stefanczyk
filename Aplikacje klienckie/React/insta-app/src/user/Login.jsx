import { Button, FormControl, Input, Box, VStack, useToast } from '@chakra-ui/react'
import { useState } from 'react'

export default function Login ({ setData }) {
  const [email, changeEmail] = useState('')
  const [password, changePassword] = useState('')
  const toast = useToast()

  const toastError = (msg) => {
    toast({
      title: 'Login failed',
      description: msg,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top'
    })
  }

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
        toastError(result.msg)
        return
      }

      setData(result.data)
    } catch (e) {
      console.error(e)
      toastError(e.message)
    }
  }

  return (
    <Box my={4}>
      <form onSubmit={(e) => loginUser(e)} className='column equal-height'>
        <VStack gap='5px'>
          <FormControl>
            <Input type='text' placeholder='E-mail' required onChange={(e) => changeEmail(e.target.value)} />
          </FormControl>
          <FormControl>
            <Input type='password' placeholder='Password' required onChange={(e) => changePassword(e.target.value)} />
          </FormControl>
        </VStack>
        <Button type='submit' mt={4} colorScheme='teal' variant='solid' size='md'>Login</Button>
      </form>
    </Box>

  )
}

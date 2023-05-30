import { useState } from 'react'
import { Button, FormControl, FormLabel, Input, Box, Alert, AlertIcon, AlertDescription, AlertTitle, CloseButton } from '@chakra-ui/react'

export default function Register () {
  const [email, changeEmail] = useState('')
  const [password, changePassword] = useState('')
  const [name, changeFirstName] = useState('')
  const [lastName, changeLastName] = useState('')
  const [url, changeUrl] = useState('')
  const [error, changeError] = useState('')

  const isUrl = url !== ''
  const isError = error !== ''

  const registerUser = async (e) => {
    e.preventDefault()
    const body = JSON.stringify({
      email,
      password,
      name,
      lastName
    })

    try {
      const response = await fetch('http://localhost:3001/api/user/register', {
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
        console.error('Register failed')
        changeError(result.msg)
        return
      }
      // window.alert(result.data)
      changeUrl(result.data)
    } catch (e) {
      console.error(e)
      changeError(e)
    }
  }

  const confirmAccount = (url) => {
    window.open(url, '_blank').focus()
    changeUrl('')
  }

  return (
    <Box my={4}>
      {
        isUrl
          ? <Alert status='success' position='absolute' top='5%' left='calc(50% - 200px)' width='fit-content' zIndex='1' gap='10px'>
            <AlertIcon />
            <Box>
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Click here to confirm your account.
              </AlertDescription>
            </Box>
            <Button onClick={() => confirmAccount(url)}>Confirm</Button>
          </Alert>
          : isError
            ? <Alert status='error' position='absolute' top='5%' left='calc(50% - 120px)' width='fit-content' zIndex='1' gap='10px'>
              <AlertIcon />
              <Box>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Box>
              <CloseButton onClick={() => changeError('')} />
            </Alert>
            : null
      }

      <form onSubmit={(e) => registerUser(e)} className='column equal-height'>
        <FormControl>
          <FormLabel>E-mail</FormLabel>
          <Input type='text' placeholder='E-mail' required onChange={(e) => changeEmail(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type='password' placeholder='Password' required onChange={(e) => changePassword(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>First name</FormLabel>
          <Input type='text' placeholder='First name' required onChange={(e) => changeFirstName(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Last name</FormLabel>
          <Input type='text' placeholder='Last name' required onChange={(e) => changeLastName(e.target.value)} />
        </FormControl>
        <Button type='submit' mt={4} colorScheme='teal' variant='solid' size='md'>Register</Button>
      </form>
    </Box>
  )
}

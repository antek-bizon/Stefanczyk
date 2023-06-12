import { useState } from 'react'
import { Button, FormControl, Input, Box, Alert, AlertIcon, AlertDescription, AlertTitle, CloseButton, HStack, VStack } from '@chakra-ui/react'

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
    console.log(body)

    try {
      const response = await fetch('http://localhost:3001/api/user/register', {
        method: 'POST',
        body,
        headers: {
          // 'Content-Type': 'application/json'
          'Content-Type': 'text/plain'
        },
        credentials: 'include'
      })

      const result = await response.json()
      if (result.err || !result.data) {
        console.error('Register failed')
        changeError(result.msg)
        return
      }
      changeUrl(result.data)
    } catch (e) {
      console.error(e)
      changeError(e.message)
    }
  }

  const confirmAccount = (url) => {
    window.open(url, '_blank').focus()
    changeUrl('')
  }

  return (
    <Box my={4}>
      <HStack w='100%' position='absolute' top='5%' left='0%' justify='center'>
        {
          isUrl
            ? (
              <Alert borderRadius='30px' status='success' width='fit-content' zIndex='calc(var(--chakra-zIndices-modal) + 1)' gap='13px'>
                <AlertIcon />
                <Box>
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Click here to confirm your account.
                  </AlertDescription>
                </Box>
                <Button colorScheme='blue' onClick={() => confirmAccount(url)}>Confirm</Button>
              </Alert>)
            : isError
              ? (
                <Alert borderRadius='30px' status='error' width='fit-content' zIndex='calc(var(--chakra-zIndices-modal) + 1)' gap='10px'>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Box>
                  <CloseButton onClick={() => changeError('')} />
                </Alert>)
              : null
        }
      </HStack>

      <form onSubmit={(e) => registerUser(e)} className='column equal-height'>
        <VStack gap='5px'>
          <FormControl>
            <Input type='email' placeholder='E-mail' required onChange={(e) => changeEmail(e.target.value)} />
          </FormControl>
          <FormControl>
            <Input type='password' placeholder='Password' required onChange={(e) => changePassword(e.target.value)} />
          </FormControl>
          <FormControl>
            <Input type='text' placeholder='First name' required onChange={(e) => changeFirstName(e.target.value)} />
          </FormControl>
          <FormControl>
            <Input type='text' placeholder='Last name' required onChange={(e) => changeLastName(e.target.value)} />
          </FormControl>
        </VStack>
        <Button type='submit' mt={4} colorScheme='teal' variant='solid' size='md'>Register</Button>
      </form>
    </Box>
  )
}

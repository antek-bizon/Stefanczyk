import React from 'react'
import { Flex, Box, Stack, Button, useDisclosure } from '@chakra-ui/react'
import ImageForm from './send/ImageForm'
import UserPage from './user/UserPage'
import UserMenu from './user/UserMenu'

export default function MainPage ({ clientData }) {
  const { isOpen: newPostIsOpen, onOpen: newPostOnOpen, onClose: newPostOnClose } = useDisclosure()

  return (
    <Flex m='0 auto' width='90%' height='100%' align='center' direction='column'>
      <Stack direction='row' width='100%' justify='space-between' bgColor='gold' p='2'>
        <Button>Explore</Button>
        <Button>My posts</Button>
        <Button onClick={newPostOnOpen}>New post</Button>
        <UserMenu profilePic='' />
      </Stack>
      <ImageForm isOpen={newPostIsOpen} onClose={newPostOnClose} token={clientData ? clientData.token : ''} />
      <Box>
        <UserPage token={clientData ? clientData.token : ''} />
      </Box>
    </Flex>

  )
}

import React from 'react'
import { Flex, Stack, Button, useDisclosure } from '@chakra-ui/react'
import ImageForm from './send/ImageForm'
import UserPage from './user/UserPage'
import UserMenu from './user/UserMenu'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import SetProfilePicture from './user/SetProfilePicture'

export default function MainPage ({ clientData, logout }) {
  const { isOpen: newPostIsOpen, onOpen: newPostOnOpen, onClose: newPostOnClose } = useDisclosure()
  const { isOpen: setPicIsOpen, onOpen: setPicOnOpen, onClose: setPicOnClose } = useDisclosure()

  return (
    <Flex m='0 auto' width='90%' height='100%' align='center' direction='column'>
      <BrowserRouter>

        <Stack direction='row' width='100%' justify='space-between' bgColor='gold' p='2'>
          <Link to='/'><Button>Explore</Button></Link>
          <Link to='/my-posts'><Button>My posts</Button></Link>

          <Button onClick={newPostOnOpen}>New post</Button>
          <UserMenu profilePic='' logout={logout} onOpen={setPicOnOpen} />
        </Stack>
        <Stack width='100%' height='100%' bgColor='white' p='2' direction='column'>
          <Routes>
            <Route path='/' element={<h1>Explore 1</h1>} />
            <Route path='/my-posts' element={<h1>My posts 1</h1>} />
            <Route
              path='/profile' element={<UserPage clientData={clientData} />}
            />
          </Routes>
        </Stack>
      </BrowserRouter>
      <ImageForm isOpen={newPostIsOpen && !setPicIsOpen} onClose={newPostOnClose} token={clientData} />
      <SetProfilePicture isOpen={setPicIsOpen && !newPostIsOpen} onClose={setPicOnClose} token={clientData} />
    </Flex>

  )
}

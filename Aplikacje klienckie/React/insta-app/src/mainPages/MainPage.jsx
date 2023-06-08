import React, { useState } from 'react'
import { Flex, Stack, Button, useDisclosure } from '@chakra-ui/react'
import ImageForm from '../send/ImageForm'
import UserPage from '../user/UserPage'
import UserMenu from '../user/UserMenu'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import SetProfilePicture from '../user/SetProfilePicture'
import ExplorePage from './ExplorePage'
import MyPostPage from './MyPostsPage'

export default function MainPage ({ cookies, logout }) {
  const { isOpen: newPostIsOpen, onOpen: newPostOnOpen, onClose: newPostOnClose } = useDisclosure()
  const { isOpen: setPicIsOpen, onOpen: setPicOnOpen, onClose: setPicOnClose } = useDisclosure()

  const clientData = {}

  const [refreshValue, runRefresh] = useState(false)

  return (
    <Flex m='0 auto' width='90%' height='100%' align='center' direction='column'>
      <BrowserRouter>
        <Stack direction='row' width='100%' justify='space-between' bgColor='gold' p='2'>
          <Link to='/'><Button>Explore</Button></Link>
          <Link to='/my-posts'><Button>My posts</Button></Link>

          <Button onClick={newPostOnOpen}>New post</Button>
          <UserMenu profilePic='' logout={logout} onOpen={setPicOnOpen} />
        </Stack>
        <Stack width='100%' minH='80vh' height='100%' bgColor='#fefefe' p='2' direction='column'>
          <Routes>
            <Route path='/my-posts' element={<MyPostPage refresh={runRefresh} refreshValue={refreshValue} />} />
            <Route
              path='/profile' element={<UserPage clientData={clientData} />}
            />
            <Route path='/' element={<ExplorePage refresh={refreshValue} />} />
            <Route path='*' element={<h1>404</h1>} />
          </Routes>
        </Stack>
      </BrowserRouter>
      <ImageForm isOpen={newPostIsOpen && !setPicIsOpen} onClose={newPostOnClose} refresh={runRefresh} refreshValue={refreshValue} />
      <SetProfilePicture isOpen={setPicIsOpen && !newPostIsOpen} onClose={setPicOnClose} token={clientData} />
    </Flex>

  )
}

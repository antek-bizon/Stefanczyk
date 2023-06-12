import React, { useState, useEffect } from 'react'
import { Flex, Stack, Button, useDisclosure, Heading, Box, HStack } from '@chakra-ui/react'
import ImageForm from '../send/ImageForm'
import UserPage from '../user/UserPage'
import UserMenu from '../user/UserMenu'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import SetProfilePicture from '../send/SetProfilePicture'
import ExplorePage from './ExplorePage'
import MyPostPage from './MyPostsPage'
import { EditIcon, PlusSquareIcon, SearchIcon } from '@chakra-ui/icons'
import Footer from './Footer'

export default function MainPage ({ logout }) {
  const { isOpen: newPostIsOpen, onOpen: newPostOnOpen, onClose: newPostOnClose } = useDisclosure()
  const { isOpen: setPicIsOpen, onOpen: setPicOnOpen, onClose: setPicOnClose } = useDisclosure()

  const [clientData, setClientData] = useState(null)
  const [refreshValue, runRefresh] = useState(false)

  async function getUserData () {
    try {
      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'GET',
        credentials: 'include'
      })

      const result = await response.json()
      if (result.err) {
        if (response.status === 401) {
          logout(true)
        } else {
          console.error(result.msg)
        }
      } else {
        setClientData(result.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getUserData()
  }, [refreshValue])

  return (
    <Flex m='0 auto' width='90%' height='100%' align='center' direction='column' bgColor='#fefefef4'>
      <BrowserRouter>
        <HStack w='100%' justify='space-between' p='4'>
          <Link to='/'><Button colorScheme='teal' leftIcon={<SearchIcon />}>Explore</Button></Link>
          <Link to='/my-posts'><Button colorScheme='green' leftIcon={<EditIcon />}>My posts</Button></Link>
          <Box>
            <Heading size='2xl' fontFamily='Brush Script MT, cursive'>InstaApp</Heading>
          </Box>
          <Button colorScheme='pink' leftIcon={<PlusSquareIcon />} onClick={newPostOnOpen}>New post</Button>
          <UserMenu profilePic={clientData?.picture} logout={logout} onOpen={setPicOnOpen} />
        </HStack>
        <Stack width='100%' minH='calc(100vh - 220px)' height='100%' p='4' direction='column'>
          <Routes>
            <Route path='/my-posts' element={<MyPostPage refresh={runRefresh} logout={logout} refreshValue={refreshValue} />} />
            <Route
              path='/profile' element={<UserPage clientData={clientData} logout={logout} refresh={runRefresh} refreshValue={refreshValue} />}
            />
            <Route path='/' element={<ExplorePage refreshValue={refreshValue} logout={logout} />} />
            <Route path='*' element={<h1>404</h1>} />
          </Routes>
        </Stack>
      </BrowserRouter>
      <ImageForm isOpen={newPostIsOpen && !setPicIsOpen} onClose={newPostOnClose} refresh={runRefresh} refreshValue={refreshValue} logout={logout} />
      <SetProfilePicture isOpen={setPicIsOpen && !newPostIsOpen} onClose={setPicOnClose} refresh={runRefresh} refreshValue={refreshValue} logout={logout} />
      <Footer />
    </Flex>
  )
}

import React, { useState, useEffect } from 'react'
import { Flex, Heading, Stack, useDisclosure } from '@chakra-ui/react'
import ImageForm from '../send/ImageForm'
import ProfilePage from './ProfilePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SetProfilePicture from '../send/SetProfilePicture'
import ExplorePage from './ExplorePage'
import MyPostPage from './MyPostsPage'
import Footer from './Footer'
import Navigation from './Navigation'
import UserPage from './UserPage'

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
        <Navigation clientData={clientData} logout={logout} newPostOnOpen={newPostOnOpen} setPicOnOpen={setPicOnOpen} />

        <Stack width='100%' minH='calc(100vh - 220px)' height='100%' p='4' direction='column'>
          <Routes>
            <Route path='/my-posts' element={<MyPostPage refresh={runRefresh} logout={logout} refreshValue={refreshValue} />} />
            <Route
              path='/profile' element={<ProfilePage clientData={clientData} logout={logout} refresh={runRefresh} refreshValue={refreshValue} />}
            />
            <Route path='/user/:email' element={<UserPage logout={logout} refreshValue={refreshValue} />} />
            <Route path='/' element={<ExplorePage refresh={runRefresh} refreshValue={refreshValue} logout={logout} />} />
            <Route path='*' element={<Heading>Nie znaleziono strony</Heading>} />
          </Routes>
        </Stack>

      </BrowserRouter>

      <ImageForm isOpen={newPostIsOpen && !setPicIsOpen} onClose={newPostOnClose} refresh={runRefresh} refreshValue={refreshValue} logout={logout} />
      <SetProfilePicture isOpen={setPicIsOpen && !newPostIsOpen} onClose={setPicOnClose} refresh={runRefresh} refreshValue={refreshValue} logout={logout} />
      <Footer />
    </Flex>
  )
}

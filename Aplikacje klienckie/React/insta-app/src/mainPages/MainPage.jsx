import React, { useEffect, useState } from 'react'
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

  const [images, setImages] = useState([])
  const clientData = {}

  async function getImagesData () {
    try {
      const response = await fetch('http://localhost:3001/api/photos', {
        method: 'GET',
        credentials: 'include'
      })
      const json = await response.json()
      console.log(json)
      if (json.err) {
        console.error(json.msg)
        console.log(cookies)
        if (!cookies.token) {
          logout()
        }
      } else {
        setImages(json.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getImagesData()
  }, [])

  console.log(images)

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
            <Route path='/my-posts' element={<MyPostPage />} />
            <Route
              path='/profile' element={<UserPage clientData={clientData} />}
            />
            <Route path='/' element={<ExplorePage images={images} />} />
            <Route path='*' element={<h1>404</h1>} />
          </Routes>
        </Stack>
      </BrowserRouter>
      <ImageForm isOpen={newPostIsOpen && !setPicIsOpen} onClose={newPostOnClose} updateImages={getImagesData} />
      <SetProfilePicture isOpen={setPicIsOpen && !newPostIsOpen} onClose={setPicOnClose} token={clientData} />
    </Flex>

  )
}

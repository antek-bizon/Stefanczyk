import { VStack, Box, IconButton } from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'
import Post from './Post'
import { useEffect, useState } from 'react'

export default function ExplorePage ({ logout, refresh }) {
  const [images, setImages] = useState([])

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
        // if (!cookies.token) {
        //   logout()
        // }
      } else {
        setImages(json.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getImagesData()
  }, [refresh])

  return (
    <Box pos='relative'>
      <IconButton icon={<RepeatIcon />} pos='sticky' top='20px' left='0' onClick={getImagesData} />
      <VStack gap='20px'>
        {images.map((e, i) => {
          return <Post key={i} image={e} />
        })}
      </VStack>
    </Box>

  )
}

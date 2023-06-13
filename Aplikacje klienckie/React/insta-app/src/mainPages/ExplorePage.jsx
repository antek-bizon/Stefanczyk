import { VStack, Box, Text } from '@chakra-ui/react'
import Post from '../elements/Post'
import { useEffect, useState } from 'react'
import RefreshComp from '../elements/RefreshComp'

export default function ExplorePage ({ refresh, refreshValue, logout }) {
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
        if (response.status === 401) {
          logout(true)
        } else {
          console.error(json.msg)
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
  }, [refreshValue])

  return (
    <Box pos='relative'>
      <RefreshComp refresh={refresh} refreshValue={refreshValue} />
      <VStack gap='20px'>
        {
          !images || images.length === 0
            ? <Text>No images :(</Text>
            : images.map((e, i) => {
              return (
                <Box w='70%' key={i}>
                  <Post image={e} refreshValue={refreshValue} />
                </Box>
              )
            })
        }
      </VStack>
    </Box>

  )
}

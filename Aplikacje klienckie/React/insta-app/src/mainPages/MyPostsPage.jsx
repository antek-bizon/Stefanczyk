import { useEffect, useState } from 'react'
import SmallPost from '../elements/SmallPost'
import { Box, Text, Wrap, WrapItem, useDisclosure } from '@chakra-ui/react'
import EditablePost from '../send/EditablePost'
import RefreshComp from '../elements/RefreshComp'

export default function MyPostPage ({ refresh, refreshValue, logout }) {
  const [images, setImages] = useState([])
  const [filters, setFilters] = useState([])
  const [tags, setTags] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  function selectImage (id) {
    onOpen()
    setSelectedImage(id)
  }

  function deselectImage () {
    onClose()
    setSelectedImage(null)
  }

  async function getAlbumImages () {
    try {
      const response = await fetch('http://localhost:3001/api/photos/album', {
        method: 'GET',
        credentials: 'include'
      })

      const result = await response.json()
      console.log(result)
      if (result.err) {
        if (response.status === 401) {
          logout(true)
        } else {
          console.error(result.msg)
        }
      } else {
        setImages(result.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function getFilters () {
    try {
      const response = await fetch('http://localhost:3001/api/filters', {
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
        setFilters(result.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function getTags () {
    try {
      const response = await fetch('http://localhost:3001/api/tags', {
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
        setTags(result.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getAlbumImages()
    getFilters()
    getTags()
  }, [refreshValue])

  return (
    <Box pos='relative'>
      <RefreshComp refresh={refresh} refreshValue={refreshValue} />
      {
        !images || images.length === 0
          ? <Text textAlign='center'>No images.<br />Please upload some images first.</Text>
          : (
            <Wrap mx='40px' w='max-content' maxW='90%' spacing='20px' p='20px'>
              {images.map((image, i) => {
                return (
                  <WrapItem key={i}>
                    <SmallPost selectImage={selectImage} id={image.id} />
                  </WrapItem>
                )
              })}
            </Wrap>)
      }

      {selectedImage && (
        <EditablePost
          image={images.find(image => image.id === selectedImage)}
          tags={tags}
          filters={filters}
          onClose={deselectImage}
          isOpen={isOpen}
          refresh={refresh}
          refreshValue={refreshValue}
          logout={logout}
        />
      )}
    </Box>
  )
}

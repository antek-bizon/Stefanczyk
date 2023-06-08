import { useEffect, useState } from 'react'
import SmallPost from './SmallPost'
import { Box, IconButton, Wrap, WrapItem, useDisclosure } from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'
import EditablePost from '../send/EditablePost'

export default function MyPostPage ({ refresh }) {
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
        console.error(result.msg)
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
        console.error(result.msg)
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
        console.error(result.msg)
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
  }, [refresh])

  return (
    <Box pos='relative'>
      <IconButton icon={<RepeatIcon />} pos='sticky' top='20px' left='0' onClick={getAlbumImages} />
      <Wrap m='auto' w='max-content' maxW='80%' spacing='20px' p='20px'>
        {
          images && images.map((image, i) => {
            return (
              <WrapItem key={i}>
                <SmallPost selectImage={selectImage} id={image.id} />
              </WrapItem>
            )
          })
        }
      </Wrap>
      {selectedImage && (
        <EditablePost
          image={images.find(image => image.id === selectedImage)}
          tags={tags}
          filters={filters}
          onClose={deselectImage}
          isOpen={isOpen}
        />
      )}
    </Box>
  )
}

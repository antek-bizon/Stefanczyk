import { Avatar, Box, Divider, Heading, Stack, Text, Wrap, WrapItem, useDisclosure } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SmallPost from '../elements/SmallPost'
import PostCloserLook from '../elements/PostCloserLook'

export default function UserPage ({ refreshValue, logout }) {
  const { email } = useParams()
  const [userData, setUserData] = useState({})
  const [images, setImages] = useState([])
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

  async function getUserData () {
    try {
      const response = await fetch('http://localhost:3001/api/author', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ email })
      })

      const result = await response.json()
      if (result.err) {
        if (response.status === 401) {
          logout(true)
        } else {
          console.error(result.msg)
        }
      } else {
        setUserData(result.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function getUserImages () {
    try {
      console.log(email)
      const response = await fetch('http://localhost:3001/api/photos/album', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ email })
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

  useEffect(() => {
    getUserData()
    getUserImages()
  }, [email, refreshValue])

  return (
    <Box>
      <Stack direction='row' spacing={10} alignItems='center'>
        {userData && (
          <>
            {userData.picture
              ? <Avatar m='15px' size='xl' src={`http://localhost:3001/${userData.picture}`} />
              : <Avatar size='xl' />}
            <Heading>{userData.name} {userData.lastName}</Heading>
          </>
        )}
      </Stack>
      <Divider my={4} />
      <Stack px='25px' direction='column' spacing={5} align='center'>
        {/* <Table variant='striped' w='60%' mb='20px'>
          <Tbody>
            {userData
              ? Object.entries(userData).map(([key, value], i) => {
                if (key === 'picture') return null
                let newKey = key.split(/(?=[A-Z])/).join(' ')
                newKey = key.charAt(0).toUpperCase() + newKey.slice(1)
                return (
                  <Tr key={i}>
                    <Td w='50%'>{newKey}</Td>
                    <Td>{value}</Td>
                  </Tr>
                )
              })
              : null}
          </Tbody>
        </Table> */}

        {
          !images || images.length === 0
            ? <Text textAlign='center'>No images.</Text>
            : (
              <>
                {/* <Heading size='lg'>Images</Heading> */}
                <Wrap alignSelf='flex-start' w='max-content' maxW='100%' spacing='20px' p='20px'>
                  {images.map((image, i) => {
                    return (
                      <WrapItem key={i}>
                        <SmallPost selectImage={selectImage} id={image.id} />
                      </WrapItem>
                    )
                  })}
                </Wrap>
              </>)
        }
      </Stack>

      {selectedImage && (
        <PostCloserLook
          image={images.find(image => image.id === selectedImage)}
          onClose={deselectImage}
          isOpen={isOpen}
        />
      )}
    </Box>
  )
}

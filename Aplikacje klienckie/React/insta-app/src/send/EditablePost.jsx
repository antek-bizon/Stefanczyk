import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  InputGroup,
  Select,
  VStack,
  InputLeftAddon,
  InputRightAddon,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast
} from '@chakra-ui/react'
import Post from '../elements/Post'
import { useState } from 'react'

function populateAddicionalData(filter) {
  switch (filter) {
    case 'rotate':
      return { degrees: 'number' }
    case 'resize':
      return { width: 'number', height: 'number' }
    case 'reformat':
      return { format: 'imageFormat' }
    case 'crop':
      return {
        width: 'number',
        height: 'number',
        x: 'number',
        y: 'number'
      }
    case 'tint':
      return {
        r: 'number',
        g: 'number',
        b: 'number'
      }
    default:
      return {}
  }
}

export default function EditablePost({ image, isOpen, onClose, filters, tags, refresh, refreshValue, logout }) {
  const [userTags, setUserTags] = useState('')
  const [filter, setFilter] = useState('rotate')
  const addicionalData = populateAddicionalData(filter)
  const toast = useToast()

  async function addTags(e) {
    e.preventDefault()
    const tagsToAdd = userTags.toLocaleLowerCase().trim().split(' ').map(t => {
      const formated = t.trim()
      if (formated.length === 0 || !/^(#)?([a-zA-Z0-9])\w+$/.test(formated)) {
        return null
      }
      if (formated.startsWith('#')) {
        return formated
      }
      return `#${formated}`
    }).filter(t => t !== null)

    if (tagsToAdd.length === 0) {
      console.log('No tags to add')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/api/photos/tags/multi', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageId: image.id,
          tags: tagsToAdd
        }),
        credentials: 'include'
      })
      const result = await response.json()
      console.log(result)
      if (result.err) {
        if (response.states === 401) {
          logout(true)
        } else {
          console.error(result.msg)
          toastError(result.msg)
        }
      } else {
        toast({
          title: 'Tags added',
          description: 'Tags added to the image',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        })
        refresh(!refreshValue)
      }
    } catch (e) {
      console.error(e)
      toastError(e)
    }
  }

  async function applyFilter(e) {
    e.preventDefault()
    const data = {}
    for (let i = 1; i < e.target.elements.length - 1; i++) {
      if (e.target.elements[i].inputMode === 'decimal') {
        data[e.target.elements[i].name] = parseInt(e.target.elements[i].value)
      } else {
        data[e.target.elements[i].name] = e.target.elements[i].value
      }
    }

    const body = JSON.stringify({
      imageId: image.id,
      filter,
      data
    })

    console.log(body)
    try {
      const response = await fetch('http://localhost:3001/api/filters', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body,
        credentials: 'include'
      })
      const result = await response.json()
      console.log(result)
      if (result.err) {
        if (response.states === 401) {
          logout(true)
        } else {
          console.error(result.msg)
          toastError(result.msg)
        }
      } else {
        refresh(!refreshValue)
        toast({
          title: 'Filter applied',
          description: 'Filter applied to the image',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        })
      }
    } catch (e) {
      console.error(e)
      toastError(e)
    }
  }

  async function deleteImage() {
    try {
      const response = await fetch(`http://localhost:3001/api/photos/${image.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const result = await response.json()
      console.log(result)
      if (result.err) {
        if (response.states === 401) {
          logout(true)
        } else {
          console.error(result.msg)
          toastError(result.msg)
        }
      } else {
        onClose()
        refresh(!refreshValue)
        toast({
          title: 'Image deleted',
          description: 'Image was successfully deleted',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        })
      }
    } catch (e) {
      console.error(e)
      toastError(e)
    }
  }

  const toastError = (msg) => {
    toast({
      title: 'Error',
      description: msg,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top'
    })
  }

  const closeModal = () => {
    onClose()
    toast.closeAll()
  }

  const onlyTagNames = image.tags.map(t => t.name)

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size='lg'>
      <ModalOverlay />
      <ModalContent my='auto'>
        <ModalHeader pb='10px'>
          Edit Image
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Post image={image} />
        </ModalBody>
        <ModalFooter>
          <VStack w='100%'>
            <form onSubmit={addTags}>
              <InputGroup>
                {tags && (
                  <InputLeftAddon p='0px' w='25%'>
                    <Select
                      placeholder='Tags' onChange={e => {
                        setUserTags(userTags + ' ' + e.target.value)
                        console.log(e.target)
                        e.target.selectedIndex = 0
                      }}
                    >
                      {tags.map((tag, i) => {
                        if (onlyTagNames.includes(tag.name) || userTags.includes(tag.name)) {
                          return null
                        }
                        return <option key={i} value={tag.name}>{tag.name}</option>
                      })}
                    </Select>
                  </InputLeftAddon>
                )}
                <Input
                  type='text' placeholder='Add tag' value={userTags}
                  onChange={e => setUserTags(e.target.value)}
                  required
                />
                <InputRightAddon p='0px'>
                  <Button colorScheme='blue' type='submit'>Add</Button>
                </InputRightAddon>
              </InputGroup>
            </form>
            <Divider />
            <form onSubmit={applyFilter}>
              <VStack>
                <Select onChange={e => setFilter(e.target.value)}>
                  {filters.map((filter, i) => {
                    return <option key={i} value={filter}>{filter}</option>
                  })}
                </Select>
                {addicionalData &&
                  Object.entries(addicionalData).map(([key, value], i) => {
                    if (value === 'imageFormat') {
                      return (
                        <Select name={key} required key={i} placeholder={key}>
                          <option value='jpg'>jpg</option>
                          <option value='png'>png</option>
                          <option value='webp'>webp</option>
                        </Select>
                      )
                    } else if (value === 'number') {
                      return (
                        <NumberInput name={key} min={0} required key={i}>
                          <NumberInputField placeholder={key} />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      )
                    }
                    return null
                  })}
                <Button colorScheme='cyan' type='submit'>Create copy with filter</Button>

                <Button onClick={deleteImage} colorScheme='red' type='reset'>Delete image and copies</Button>
              </VStack>
            </form>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

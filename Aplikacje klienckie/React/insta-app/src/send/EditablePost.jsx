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
  Divider
} from '@chakra-ui/react'
import Post from '../mainPages/Post'
import { useState } from 'react'

export default function EditablePost ({ image, isOpen, onClose, filters, tags, refresh, refreshValue }) {
  const [userTags, setUserTags] = useState('')

  async function addTags (e) {
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
        console.error(result.msg)
      } else {
        refresh(!refreshValue)
        setUserTags('')
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
                        if (image.tags.includes(tag) || userTags.includes(tag.name)) {
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
                  <Button type='submit'>Add</Button>
                </InputRightAddon>
              </InputGroup>
            </form>
            <Divider />
            <InputGroup>
              <Select>
                {filters.map((filter, i) => {
                  return <option key={i} value={filter}>{filter}</option>
                })}
              </Select>
              <InputRightAddon p='0px'>
                <Button type='submit'>Create copy with filter</Button>
              </InputRightAddon>
            </InputGroup>
          </VStack>

        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

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
  InputLeftElement,
  InputRightElement,
  Select,
  VStack
} from '@chakra-ui/react'
import Post from '../mainPages/Post'

export default function EditablePost ({ image, isOpen, onClose, filters, tags }) {
  console.log(image)
  console.log(filters)
  console.log(tags)
  console.log(isOpen)
  console.log(onClose)
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Post image={image} />
        </ModalBody>
        <ModalFooter>
          <VStack w='100%'>
            <InputGroup>
              {tags && (
                <InputLeftElement>
                  <Select>
                    {tags.map((tag, i) => {
                      if (image.tags.includes(tag)) {
                        return null
                      }
                      return <option key={i} value={tag.id}>{tag.name}</option>
                    })}
                  </Select>
                </InputLeftElement>
              )}
              <Input type='text' placeholder='Add tag' />
              <InputRightElement>
                <Button>Add</Button>
              </InputRightElement>
            </InputGroup>
            <Select>
              {filters.map((filter, i) => {
                return <option key={i} value={filter}>{filter}</option>
              })}
            </Select>
          </VStack>

        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

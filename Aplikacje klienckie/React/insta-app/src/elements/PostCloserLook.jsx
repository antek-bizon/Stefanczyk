import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import Post from './Post'

export default function PostCloserLook ({ isOpen, onClose, image }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent my='auto'>
        <ModalHeader p='20px'>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Post image={image} />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  )
}

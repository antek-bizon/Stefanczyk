import { Button, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import SendImagePreview from '../elements/SendImagePreview'

export default function ImageForm ({ isOpen, onClose, refresh, refreshValue, logout }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const toast = useToast()

  const sendFile = async (e) => {
    e.preventDefault()

    const body = new FormData()
    body.append('file', selectedFile)

    try {
      const response = await fetch('http://localhost:3001/api/photos', {
        method: 'POST',
        body,
        credentials: 'include'
      })

      const result = await response.json()
      if (result.err) {
        if (response.status === 401) {
          logout(true)
        } else {
          console.error('Sending file went wrong:', result.msg)
          toastError(result.msg)
        }
      } else {
        toast({
          title: 'Success',
          description: result.data,
          duration: 4000,
          isClosable: true,
          status: 'success',
          position: 'top'
        })
        refresh(!refreshValue)
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
      duration: 9000,
      isClosable: true,
      position: 'top'
    })
  }

  const closeModal = () => {
    toast.closeAll()
    setSelectedFile(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Image</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={(e) => sendFile(e)}>
          <ModalBody>
            {selectedFile
              ? <SendImagePreview inputFile={selectedFile} />
              : <FormLabel>Choose file</FormLabel>}
            <Input type='file' accept='image/*' required onChange={(e) => setSelectedFile(e.target.files[0])} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' type='submit'>Send</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, CloseButton, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { useState } from 'react'

export default function ImageForm ({ isOpen, onClose, refresh, refreshValue }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, changeError] = useState('')
  const [fetchMsg, changeFetchMsg] = useState('')

  const isError = error !== ''
  const isFetchMsg = fetchMsg !== ''

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
        console.error('Sending file went wrong')
        changeError(result.msg)
        return
      }
      changeFetchMsg(result.data)
      refresh(!refreshValue)
    } catch (e) {
      console.error(e)
      changeError(e)
    }
  }

  const closeModal = () => {
    changeError('')
    changeFetchMsg('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <HStack w='100%' position='absolute' top='5%' left='0%' justify='center'>
        {
          isFetchMsg
            ? (
              <Alert status='success' width='fit-content' zIndex='calc(var(--chakra-zIndices-modal) + 1)' gap='10px'>
                <AlertIcon />
                <Box>
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Image uploaded successfully!
                  </AlertDescription>
                </Box>
                <CloseButton onClick={() => changeFetchMsg('')} />
              </Alert>)
            : isError
              ? (
                <Alert status='error' width='fit-content' zIndex='calc(var(--chakra-zIndices-modal) + 1)' gap='10px'>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Box>
                  <CloseButton onClick={() => changeError('')} />
                </Alert>)
              : null
        }
      </HStack>

      <ModalContent>
        <ModalHeader>Upload Image</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={(e) => sendFile(e)}>
          <ModalBody>
            <FormLabel>Choose file</FormLabel>
            <Input type='file' accept='image/*' required onChange={(e) => setSelectedFile(e.target.files[0])} />
          </ModalBody>
          <ModalFooter>
            <button type='submit'>Send</button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, CloseButton, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { useState } from 'react'

export default function SetProfilePicture ({ isOpen, onClose, token }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, changeError] = useState('')
  const [fetchMsg, changeFetchMsg] = useState('')

  const isError = error !== ''
  const isFetchMsg = fetchMsg !== ''

  const sendFile = async (e) => {
    e.preventDefault()

    const body = new FormData()
    body.append('file', selectedFile)
    body.append('album', 'smok241')

    try {
      const response = await fetch('http://localhost:3001/api/profile/picture', {
        method: 'POST',
        body
        // headers: {
        //   'Content-Type': 'text/plain',
        //   Authorization: 'Bearer ' + clientToken
        // }
      })

      const result = await response.json()
      if (result.err) {
        console.error('Sending file went wrong')
        changeError(result.msg)
        return
      }
      changeFetchMsg(result.data)
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
      {
        isFetchMsg
          ? (
            <Alert status='success' position='absolute' top='5%' left='calc(50% - 200px)' width='fit-content' zIndex='calc(var(--chakra-zIndices-modal) + 1)' gap='10px'>
              <AlertIcon />
              <Box>
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Profile picture updated!
                </AlertDescription>
              </Box>
              <CloseButton onClick={() => changeFetchMsg('')} />
            </Alert>)
          : isError
            ? (
              <Alert status='error' position='absolute' top='5%' left='calc(50% - 120px)' width='fit-content' zIndex='calc(var(--chakra-zIndices-modal) + 1)' gap='10px'>
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
      <ModalContent>
        <ModalHeader>Set profile picture</ModalHeader>
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

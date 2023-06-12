import { Box, Image } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function SendImagePreview ({ inputFile }) {
  if (!inputFile) return null
  const [src, setSrc] = useState('')
  const fileReader = new FileReader()
  fileReader.readAsDataURL(inputFile)

  useEffect(() => {
    fileReader.onload = (e) => {
      setSrc(e.target.result)
    }
  }, [inputFile])

  return (
    <Box mb='3'>
      <Image src={src} />
    </Box>
  )
}

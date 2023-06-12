import { RepeatIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'

export default function RefreshComp ({ refresh, refreshValue }) {
  return (
    <IconButton
      colorScheme='blue'
      icon={<RepeatIcon />}
      pos='sticky' top='20px' left='0'
      onClick={() => refresh(!refreshValue)}
    />
  )
}

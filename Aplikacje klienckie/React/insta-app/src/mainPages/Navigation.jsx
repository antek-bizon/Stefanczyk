import { EditIcon, PlusSquareIcon, SearchIcon } from '@chakra-ui/icons'
import { Box, Button, HStack, Heading } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import UserMenu from '../user/UserMenu'

export default function Navigation ({ newPostOnOpen, clientData, logout, setPicOnOpen }) {
  return (
    <HStack w='100%' justify='space-between' p='4'>
      <Link to='/'><Button colorScheme='teal' leftIcon={<SearchIcon />}>Explore</Button></Link>
      <Link to='/my-posts'><Button colorScheme='green' leftIcon={<EditIcon />}>My posts</Button></Link>
      <Box>
        <Heading size='2xl' fontFamily='Brush Script MT, cursive'>InstaApp</Heading>
      </Box>
      <Button colorScheme='pink' leftIcon={<PlusSquareIcon />} onClick={newPostOnOpen}>New post</Button>
      <UserMenu profilePic={clientData?.picture} logout={logout} onOpen={setPicOnOpen} />
    </HStack>
  )
}

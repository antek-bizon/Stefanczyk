import { Menu, MenuList, MenuItem, MenuButton, Avatar } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function UserMenu ({ profilePic, logout, onOpen }) {
  return (
    <Menu>
      <MenuButton>
        {profilePic
          ? <Avatar size='md' src={`http://localhost:3001/${profilePic}`} />
          : <Avatar size='md' />}
      </MenuButton>
      <MenuList>
        <Link to='/profile'><MenuItem>Profile settings</MenuItem></Link>
        <MenuItem onClick={onOpen}>Set profile picture</MenuItem>
        <MenuItem onClick={() => logout()}>Logout</MenuItem>
      </MenuList>
    </Menu>
  )
}

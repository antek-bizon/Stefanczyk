import { Menu, MenuList, MenuItem, MenuButton, Avatar } from '@chakra-ui/react'
import React from 'react'

export default function UserMenu ({ profilePic }) {
  const logout = () => {
    window.sessionStorage.removeItem('sesionData')
    window.location.reload()
  }

  return (
    <Menu>
      <MenuButton>
        <Avatar src={profilePic} />
      </MenuButton>
      <MenuList>
        <MenuItem>My profile</MenuItem>
        <MenuItem>Set profile picture</MenuItem>
        <MenuItem onClick={() => logout()}>Logout</MenuItem>
      </MenuList>
    </Menu>
  )
}

// import { useState } from 'react'
import Login from './Login'
import Register from './Register'
import { Flex, Box, Tabs, Tab, TabList, TabPanel, TabPanels } from '@chakra-ui/react'

export default function UserValidation ({ setData }) {
  return (
    <Flex m='0 auto' width='90%' height='100%' align='center' justify='center' direction='column'>
      <Box borderRadius='25px' bgColor='white' minH='510px' p='30px' boxShadow='lg'>
        <Tabs isFitted variant='enclosed'>
          <TabList>
            <Tab>Login</Tab>
            <Tab>Register</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login setData={setData} />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  )
}

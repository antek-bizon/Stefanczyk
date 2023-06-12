// import { useState } from 'react'
import Login from './Login'
import Register from './Register'
import { Box, Tabs, Tab, TabList, TabPanel, TabPanels, VStack } from '@chakra-ui/react'

export default function UserValidation ({ setData }) {
  return (
    <VStack alignSelf='center' m='0 auto' width='90%' align='center' pb='8vh' justify='center'>
      <Box borderRadius='25px' bgColor='white' minH='420px' p='30px' boxShadow='lg'>
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
    </VStack>
  )
}

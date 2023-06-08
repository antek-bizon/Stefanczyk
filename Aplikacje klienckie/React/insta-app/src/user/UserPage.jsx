import React from 'react'
import { Avatar, Box, Heading, Stack, Table, Tbody, Tr, Td, Divider } from '@chakra-ui/react'

export default function UserPage ({ clientData }) {
  const tableData = Object.entries(clientData).map(([key, value], i) => {
    if (key === 'token') return null
    key = key.split(/(?=[A-Z])/).join(' ')
    key = key.charAt(0).toUpperCase() + key.slice(1)
    return (
      <Tr key={i}>
        <Td>{key}</Td>
        <Td>{value}</Td>
      </Tr>
    )
  })

  return (
    <Box>
      <Stack direction='row' spacing={10} alignItems='center'>
        <Avatar w='25%' h='25%' />
        <Heading>{clientData.name}</Heading>
      </Stack>
      <Divider my={4} />
      <Stack direction='column' spacing={4} align='center'>
        <Table w='60%'>
          <Tbody>
            {tableData}
          </Tbody>
        </Table>
      </Stack>
    </Box>

  )
}

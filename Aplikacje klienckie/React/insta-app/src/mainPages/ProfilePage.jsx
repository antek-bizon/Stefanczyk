import React, { useEffect, useState } from 'react'
import { Avatar, Box, Heading, Stack, Table, Tbody, Tr, Td, Divider, Button, ButtonGroup, Input } from '@chakra-ui/react'

export default function ProfilePage ({ clientData, refreshValue, refresh, logout }) {
  const [modify, setModify] = useState(false)
  const [modifyData, setModifyData] = useState(clientData)

  async function updateProfileInfo (e) {
    e.preventDefault()
    console.log(modifyData)
    try {
      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: modifyData.name,
          lastName: modifyData.lastName
        })
      })

      const result = await response.json()
      if (result.err) {
        if (response.status === 401) {
          logout()
        } else {
          console.error(result.msg)
        }
      } else {
        refresh(!refreshValue)
        setModify(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    setModifyData(clientData)
  }, [clientData])

  return (
    <Box>
      <form onSubmit={updateProfileInfo}>
        <Stack direction='row' spacing={10} alignItems='center'>
          {clientData && (
            <>
              {clientData.picture
                ? <Avatar m='15px' size='xl' src={`http://localhost:3001/${clientData.picture}`} />
                : <Avatar size='xl' />}
              <Heading>{clientData.name} {clientData.lastName}</Heading>
            </>
          )}
        </Stack>
        <Divider my={4} />
        <Stack direction='column' spacing={4} align='center'>
          <Table variant='striped' w='60%'>
            <Tbody>
              {(clientData)
                ? Object.entries(clientData).map(([key, value], i) => {
                  if (key === 'picture') return null
                  let newKey = key.split(/(?=[A-Z])/).join(' ')
                  newKey = key.charAt(0).toUpperCase() + newKey.slice(1)
                  return (
                    <Tr key={i}>
                      <Td w='50%'>{newKey}</Td>
                      <Td>{modify
                        ? (
                          <Input
                            border='2px solid #5B5B5B'
                            type='text'
                            required
                            isDisabled={key === 'email'}
                            placeholder={newKey}
                            value={modifyData[key]}
                            onChange={e => setModifyData({ ...modifyData, [key]: (e.target.value) })}
                          />)
                        : value}
                      </Td>
                    </Tr>
                  )
                })
                : null}
            </Tbody>
          </Table>
          {modify
            ? (
              <ButtonGroup>
                <Button colorScheme='blue' type='submit'>Save</Button>
                <Button
                  colorScheme='red' onClick={() => {
                    setModify(false)
                    setModifyData(clientData)
                  }}
                >Cancel
                </Button>
              </ButtonGroup>)
            : <Button colorScheme='blue' onClick={() => setModify(true)}>Modify user data</Button>}
        </Stack>
      </form>
    </Box>
  )
}

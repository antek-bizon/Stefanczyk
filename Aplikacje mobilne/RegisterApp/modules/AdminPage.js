import { Button, Divider, Icon, Layout, List, ListItem } from '@ui-kitten/components'
import BackNav from './nav/BackNav'
import { useEffect, useState } from 'react'
import { hostIp } from './Ip'

const AdminPage = ({ prevPage, detailsPage }) => {
  const [users, setUsers] = useState(new Map())

  const getUsers = async () => {
    try {
      const response = await fetch('http://' + hostIp + '/api/users', {
        method: 'GET'
      })

      if (!response.ok) {
        const result = await response.text()
        console.error(result)
      } else {
        const result = await response.json()
        setUsers(new Map(result.body))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const deleteUser = async (name) => {
    try {
      const response = await fetch('http://' + hostIp + '/api/users', {
        method: 'DELETE',
        body: JSON.stringify({ name }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.text()
      if (!response.ok) {
        console.error(result)
      } else {
        getUsers()
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  const renderItem = ({ item, index }) => {
    const itemAccessory = () => (
      <Layout style={{ flex: 1, flexDirection: 'row', gap: 10, margin: 3 }}>
        <Button onPress={() => detailsPage(users.get(item))} size='small'>Details</Button>
        <Button onPress={() => deleteUser(item)} size='small'>Delete</Button>
      </Layout>
    )

    return (
      <ListItem
        title={`${index + 1}. ${item}`}
        accessoryLeft={<Icon name='person' />}
        accessoryRight={itemAccessory}
      />
    )
  }

  return (
    <>
      <BackNav title='Admin page' onPress={prevPage} />
      <Button style={{ margin: 20 }} onPress={() => prevPage()}>Back to register page</Button>
      {users &&
        <List
          renderItem={renderItem}
          data={Array.from(users.keys())}
          ItemSeparatorComponent={Divider}
        />}
    </>
  )
}

export default AdminPage

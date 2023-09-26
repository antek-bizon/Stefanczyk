import { Button, Divider, Icon, Layout, List, ListItem } from '@ui-kitten/components'
import BackNav from './nav/BackNav'

const AdminPage = ({ users, prevPage, detailsPage, deleteUser }) => {
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

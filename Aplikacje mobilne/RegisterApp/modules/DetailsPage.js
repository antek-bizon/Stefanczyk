import { Avatar, Divider, Layout, Text } from '@ui-kitten/components'
import BackNav from './nav/BackNav'
import { StyleSheet } from 'react-native'

const DetailsPage = ({ user, prevPage }) => {
  if (!user) return <></>
  return (
    <>
      <BackNav title='Details page' onPress={prevPage} />
      <Layout style={styles.content}>
        <Avatar style={styles.avatar} source={require('../assets/avatar.jpg')} />
        <Text category='h5'>Login</Text>
        <Text category='p1'>{user.login}</Text>
        <Divider />
        <Text category='h5'>Password</Text>
        <Text category='p1'>{user.password}</Text>
        <Divider />
        <Text category='h5'>Registered</Text>
        <Text category='p1'>{new Date(user.date).toDateString()}</Text>
      </Layout>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  avatar: {
    width: 150,
    height: 150
  }
}
)

export default DetailsPage

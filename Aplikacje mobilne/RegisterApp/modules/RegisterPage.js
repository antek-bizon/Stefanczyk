import { useState } from 'react'
import { Alert, StyleSheet } from 'react-native'
import { Button, Icon, Input, Layout, Text } from '@ui-kitten/components'
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport'
import { hostIp } from './Ip'

const RegisterPage = ({ adminPage }) => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  const registerUser = async (name, password) => {
    try {
      const response = await fetch('http://' + hostIp + '/api/register', {
        method: 'POST',
        body: JSON.stringify({ name, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.text()
      if (!response.ok) {
        if (response.status === 403) {
          Alert.alert('User already exists', name)
        } else {
          console.error(result)
        }
      } else {
        console.log('success')
        adminPage()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry)
  }

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon
        {...props}
        name={secureTextEntry ? 'eye-off' : 'eye'}
      />
    </TouchableWithoutFeedback>
  )

  return (
    <Layout style={styles.containter}>
      <Layout style={styles.header}>
        <Text category='h1' style={{ color: 'white' }}>Register</Text>
      </Layout>
      <Layout style={styles.content}>
        <Text category='h6'>Welcome in app</Text>
        <Input
          value={name}
          onChangeText={nextValue => setName(nextValue)}
          placeholder='Name'
        />
        <Input
          value={password}
          onChangeText={nextValue => setPassword(nextValue)}
          placeholder='Password'
          secureTextEntry={secureTextEntry}
          accessoryRight={renderIcon}
        />
        <Button onPress={() => {
          if (name && password) {
            registerUser(name, password)
          }
        }}
        >Register
        </Button>
      </Layout>
    </Layout>

  )
}

export default RegisterPage

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    flexDirection: 'column'
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue'
  },

  content: {
    flex: 1,
    flexDirection: 'column',
    gap: 15,
    alignItems: 'center',
    paddingHorizontal: '20%',
    paddingVertical: 20
  }
})

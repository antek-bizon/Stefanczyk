import { Button, Dialog, TextInput } from 'react-native-paper'
import AppBar from './AppBar'

export default function SettingsPage ({ goBack }) {
  return (
    <>
      <AppBar title='Settings' onPress={goBack} />
      <Dialog visible>
        <Dialog.Title>Set server paramiters</Dialog.Title>
        <Dialog.Content>
          <TextInput placeholder='IP address' />
          <TextInput placeholder='Port' keyboardType='number-pad' onChangeText={(e) => { console.log(e) }} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button>Cancel</Button>
          <Button>Set</Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

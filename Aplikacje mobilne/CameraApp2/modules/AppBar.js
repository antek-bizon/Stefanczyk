import { Appbar, useTheme } from 'react-native-paper'

export default function AppBar ({ onPress, title }) {
  const theme = useTheme()
  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
      <Appbar.BackAction onPress={onPress} color={theme.colors.onPrimary} />
      <Appbar.Content title={title} color={theme.colors.onPrimary} />
    </Appbar.Header>
  )
}

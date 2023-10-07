import { ArrowBackIcon, Heading, HStack, IconButton, useTheme } from 'native-base'

export default function AppBar ({ title, backAction }) {
  const theme = useTheme()

  return (
    <HStack bg={theme.colors.secondary[500]} px='1' py='3' alignItems='center' w='100%'>
      {
        backAction && <IconButton onPress={() => backAction()} mx='2' icon={<ArrowBackIcon color={theme.colors.secondary[50]} />} />
      }
      {title && <Heading color={theme.colors.secondary[50]} mx='2'>{title}</Heading>}
    </HStack>
  )
}

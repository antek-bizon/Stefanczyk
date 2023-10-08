import { ArrowBackIcon, Heading, HStack, IconButton } from 'native-base'

export default function AppBar ({ title, backAction }) {
  return (
    <HStack bg='secondary.500' px='1' py='3' alignItems='center' w='100%'>
      {
        backAction && <IconButton onPress={() => backAction()} mx='2' icon={<ArrowBackIcon color='lightText' />} />
      }
      {title && <Heading color='lightText' mx='2'>{title}</Heading>}
    </HStack>
  )
}

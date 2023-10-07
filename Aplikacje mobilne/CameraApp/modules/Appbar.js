import { ArrowBackIcon, Box, Heading, HStack, Icon, IconButton, Text, useTheme } from "native-base";

export default function AppBar({title}) {
  const theme = useTheme()

  return (
      <HStack bg={theme.colors.secondary[500]} px="1" py="3" alignItems="center" w='100%'>
          <IconButton mx='2' icon={<ArrowBackIcon/>} />
          {title && <Heading  mx='2'>{title}</Heading>}
      </HStack>
  )
}
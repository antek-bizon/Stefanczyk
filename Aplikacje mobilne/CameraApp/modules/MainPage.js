import { Button, FlatList, HStack, Image, VStack } from "native-base"
import AppBar from "./Appbar"


const MainPage = ({}) => {
  const menuButtons = [
    {title: 'Layout', func: null},
    {title: 'Camera', func: null},
    {title: 'Delete', func: null}
  ]

  const images = [
    {src: 'https://cdn.pixabay.com/photo/2017/02/01/22/02/mountain-landscape-2031539_640.jpg', description: 'Landscape'}
  ]

  return (
    <VStack>
      <AppBar title='Photos inside DCIM'/>
      <HStack p='3' justifyContent='space-evenly'>
        {
          menuButtons.map((e, i) => <Button size='lg' key={i} onPress={e.func}>{e.title}</Button>)
        }
      </HStack>
      <FlatList data={images} renderItem={({item}) => {
        <Box>
          <Image src={item.src}></Image>
          <Text>{item.description}</Text>
        </Box>
      }}/>
    </VStack>
  )
}

export default MainPage
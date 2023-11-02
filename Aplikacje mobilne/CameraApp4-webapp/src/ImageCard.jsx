import { Button, Card, Flex, Image, Text } from 'rebass'

const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'

// eslint-disable-next-line react/prop-types
export default function ImageCard ({ filename = '', url = defaultImage, onSelect = () => {} }) {
  const buttons = () => {
    [
      { title: 'Delete', handleClick: () => {} },
      { title: 'Rename', handleClick: () => {} }
    ].map((e, i) => (
      <Button key={i} bg='#009688' className='hover' onClick={e.handleClick}>{e.title}</Button>
    ))
  }

  return (
    <Card
      width='20%' bg='#e1bee7' padding='8px'
      boxShadow='0 2px 16px rgba(0, 0, 0, 0.25)'
      borderRadius={8}
    >
      <Flex flexDirection='column' className='gap'>
        <Text>{filename}</Text>
        <Image src={url} borderRadius={8} />
        {buttons()}
        <input
          type='checkbox' onClick={(e) => {
            console.log(e)
            onSelect()
          }}
        />
      </Flex>
    </Card>
  )
}

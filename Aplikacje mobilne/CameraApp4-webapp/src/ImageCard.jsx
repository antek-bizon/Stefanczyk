/* eslint-disable react/prop-types */
import { Button, Card, Flex, Image, Text } from 'rebass'

const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'

export default function ImageCard ({
  filename = '', url = defaultImage, refresh = () => { }, onRename = () => { },
  onDelete = () => { }, isSelected = false, onSelect = () => { }
}) {
  const buttons = () => {
    [
      { title: 'Delete', handleClick: () => { } },
      { title: 'Rename', handleClick: () => { } }
    ].map((e, i) => (
      <Button key={i} bg='#009688' className='hover' onClick={e.handleClick}>{e.title}</Button>
    ))
  }

  return (
    <Card
      margin='15px 0px' className='tertiary-container border-radius boxShadow'
      width='20%' padding='16px'
    >
      <Flex flexDirection='column' className='gap'>
        <Text height='45px' className='text-wrap on-tertiary-container-text'>{filename}</Text>
        <Image height='200px' src={url} className='border-radius' />
        {buttons()}
        <input
          checked={isSelected}
          type='checkbox' onChange={() => {
            onSelect(filename)
          }}
        />
        <Button
          className='error on-error-text hover' onClick={async () => {
            await onDelete([filename])
            refresh()
          }}
        >Delete
        </Button>
        <Button
          onClick={async () => {
            await onRename(filename)
            refresh()
          }}
          className='tertiary on-tertiary-text hover'
        >Rename
        </Button>
      </Flex>
    </Card>
  )
}

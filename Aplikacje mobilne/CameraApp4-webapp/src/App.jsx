import { useEffect, useState } from 'react'
import { Box, Button, Flex, Heading } from 'rebass'
import './App.css'
import ImageCard from './ImageCard'

async function fetchData () {
  return [{ filename: 'test' }]
}

function App () {
  const [images, setImages] = useState([])

  useEffect(() => {
    fetchData()
      .then(arr => setImages(arr))
      .catch(e => console.error(e))
  })

  const navButtons = () => {
    return [
      { title: 'Reload', handleClick: () => {} },
      { title: 'Select all', handleClick: () => {} },
      { title: 'Remove selected', handleClick: () => {} }
    ].map((e, i) => (
      <Button key={i} bg='#009688' className='hover' onClick={e.handleClick}>{e.title}</Button>
    ))
  }

  return (
    <Flex
      flexDirection='column'
      justifyContent='flex-start'
      flex='1'
    >
      <Box bg='#e1bee7' padding='20px'>
        <Heading paddingBottom='10px'>Uploaded Images</Heading>
        <Flex className='gap'>
          {navButtons()}
        </Flex>
      </Box>

      <Flex flexWrap='wrap' padding='15px'>
        {images.map((e, i) => (
          <ImageCard key={i} filename={e.filename} url={e.url} />
        ))}
      </Flex>

    </Flex>
  )
}

export default App

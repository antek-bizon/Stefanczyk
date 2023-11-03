import { useEffect, useState } from 'react'
import { Box, Button, Flex, Heading } from 'rebass'
import './App.css'
import './css/theme.css'
import ImageCard from './ImageCard'

async function fetchData () {
  let images = []
  try {
    const response = await fetch('http://localhost:3000/files',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'plain/text'
        }
      })

    if (response.ok) {
      const result = await response.json()
      images = [...result]
    } else {
      throw await response.text()
    }
  } catch (e) {
    console.error(e)
  }

  return images
}

async function deleteImages (images) {
  const body = JSON.stringify((Array.isArray(images)) ? images : Array.from(images))

  const response = await fetch('http://localhost:3000/files',
    {
      method: 'DELETE',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  const result = await response.text()

  if (!response.ok) {
    throw result
  }
}

async function renameImage (image) {
  if (!image) return

  let newName
  do {
    newName = window.prompt('Enter new name:')
    if (newName === null) return
  } while (newName === '')

  try {
    const body = JSON.stringify({ oldName: image, newName })
    const response = await fetch('http://localhost:3000/rename',
      {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    const result = await response.text()

    if (!response.ok) {
      throw result
    }
  } catch (e) {
    console.log(e)
  }
}

function App () {
  const [images, setImages] = useState([])
  const [selectedImages, selectImage] = useState(new Set())
  const [reloadBool, reload] = useState(false)

  const refresh = () => reload(prev => !prev)

  useEffect(() => {
    fetchData()
      .then(arr => setImages(arr))
      .catch(e => console.error(e))
  }, [reloadBool])

  const navButtons = () => {
    return [
      { title: 'Reload', handleClick: () => refresh() },
      {
        title: (selectedImages.size === images.length)
          ? 'Deselect all'
          : 'Select all',
        handleClick: (selectedImages.size === images.length)
          ? () => selectImage(new Set())
          : () => selectImage(new Set(images))
      },
      {
        title: 'Remove selected',
        handleClick: async () => {
          try {
            if (selectedImages.size <= 0) return
            await deleteImages(selectedImages.values())
            refresh()
          } catch (e) {
            console.error(e)
          }
        }
      }
    ].map((e, i) => (
      <Button key={i} className='hover primary' onClick={e.handleClick}>{e.title}</Button>
    ))
  }

  const onSelect = (image) => {
    if (!image) return

    if (selectedImages.has(image)) {
      selectImage(prev => {
        const next = new Set(prev)
        next.delete(image)
        return next
      })
    } else {
      selectImage(prev => {
        const next = new Set(prev)
        next.add(image)
        return next
      })
    }
  }

  return (
    <Flex
      flexDirection='column'
      justifyContent='flex-start'
      flex='1'
    >
      <Box className='surface' padding='20px'>
        <Heading paddingBottom='10px' className='on-surface-text'>Uploaded Images</Heading>
        <Flex className='gap'>
          {navButtons()}
        </Flex>
      </Box>

      <Flex
        flexWrap='wrap'
        justifyContent='space-evenly'
        padding='15px'
        className='gap'
      >
        {images.map((e, i) => (
          <ImageCard
            key={i}
            filename={e}
            isSelected={selectedImages.has(e)}
            onSelect={onSelect}
            onDelete={deleteImages}
            onRename={renameImage}
            refresh={refresh}
            url={`http://localhost:3000/${e}`}
          />
        ))}
      </Flex>

    </Flex>
  )
}

export default App

import { useEffect, useState } from 'react'
import { Avatar, HStack, Box, Card, CardBody, CardFooter, CardHeader, Divider, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text, Wrap } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export default function Post ({ image, refreshValue, logout }) {
  const [authorData, setAuthorData] = useState({})

  const date = (image.history[0].timestamp)
    ? new Date(parseInt(image.history[0].timestamp)).toLocaleString()
    : null

  const imagesUrl = [image.url]
  image.history.forEach(e => {
    if (e.url && !imagesUrl.includes(e.url)) {
      imagesUrl.push(e.url)
    }
  })

  async function getUserData () {
    if (!image.album) return
    try {
      const response = await fetch('http://localhost:3001/api/author', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ email: image.album })
      })

      const result = await response.json()
      if (result.err) {
        if (response.status === 401) {
          logout(true)
        } else {
          console.error(result.msg)
        }
      } else {
        setAuthorData(result.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getUserData()
  }, [refreshValue])

  return (
    <Card overflow='hidden' w='100%'>
      <CardHeader pb='10px' display='flex' alignItems='center' justifyContent='space-between'>
        {authorData.email && (
          <Link to={`/user/${authorData.email}`}>
            <HStack spacing='15px'>
              {authorData.picture
                ? <Avatar size='sm' src={`http://localhost:3001/${authorData.picture}`} />
                : <Avatar size='sm' />}
              {(authorData.name && authorData.lastName)
                ? <Text>{authorData.name} {authorData.lastName}</Text>
                : <Text>Anonymous</Text>}
            </HStack>
          </Link>
        )}
        <Text>{date}</Text>
      </CardHeader>
      <Divider />
      <CardBody>
        <Tabs align='center' variant='unstyled'>
          <TabPanels>
            {imagesUrl.map((e, i) => {
              return (
                <TabPanel key={i}>
                  <Box w='100%' h='300px' bgSize='contain' bgPos='center' bgRepeat='no-repeat' bgImg={`url(http://localhost:3001/${e})`} />
                </TabPanel>
              )
            })}
          </TabPanels>
          <TabList>
            {imagesUrl.map((_, i) => (
              <Tab
                mx='5px'
                borderRadius='full'
                bgColor='gray.300'
                boxShadow='lg'
                _selected={{ bgColor: 'green.400' }}
                h='20px' key={i}
              />))}
          </TabList>
        </Tabs>
      </CardBody>
      <Divider />
      <CardFooter>
        <Wrap>
          {image.tags.map((e, i) => {
            return <Tag key={i}>{e.name}</Tag>
          })}
        </Wrap>
      </CardFooter>
    </Card>
  )
}

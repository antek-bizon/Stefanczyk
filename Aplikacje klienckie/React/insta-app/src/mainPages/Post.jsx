import { Card, CardBody, CardFooter, CardHeader, Image, Tag } from '@chakra-ui/react'

export default function Post ({ image }) {
  return (
    <Card overflow='hidden'>
      <CardHeader>
        {image.album}
      </CardHeader>
      <CardBody>
        <Image h='400px' src={`http://localhost:3001/api/getfile/${image.id}`} alt={image.originalName} />

      </CardBody>
      <CardFooter>
        {image.originalName}
        {image.tags.map((e, i) => {
          return <Tag key={i}>{e.name}</Tag>
        })}
      </CardFooter>
    </Card>
  )
}

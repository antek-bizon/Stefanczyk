import { Card, CardBody, CardFooter, CardHeader, Image, Tag, Wrap } from '@chakra-ui/react'

export default function Post ({ image }) {
  console.log(image)
  return (
    <Card overflow='hidden'>
      <CardHeader pb='10px'>
        {image.album}
      </CardHeader>
      <CardBody>
        <Image h='400px' src={`http://localhost:3001/api/getfile/${image.id}`} alt={image.originalName} />
      </CardBody>
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

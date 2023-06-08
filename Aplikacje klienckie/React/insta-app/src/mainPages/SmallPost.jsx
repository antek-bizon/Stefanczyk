import { Card, CardBody, Image, Link } from '@chakra-ui/react'

export default function SmallPost ({ id, selectImage }) {
  return (
    <Link
      transition='300ms' _hover={{
        filter: 'brightness(0.8)'
      }}
      onClick={() => selectImage(id)}
    >
      <Card overflow='hidden'>
        <CardBody>
          <Image w='100px' h='100px' src={`http://localhost:3001/api/getfile/${id}`} />
        </CardBody>
      </Card>
    </Link>
  )
}

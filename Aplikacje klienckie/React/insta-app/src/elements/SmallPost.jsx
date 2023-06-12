import { Card, Link } from '@chakra-ui/react'

export default function SmallPost ({ id, selectImage }) {
  return (
    <Link
      transition='300ms' _hover={{
        filter: 'brightness(0.8)'
      }}
      onClick={() => selectImage(id)}
    >
      <Card
        w='200px' h='200px'
        bgSize='cover' bgPos='center' bgRepeat='no-repeat' bgImage={`url(http://localhost:3001/api/getfile/${id})`}
      />
    </Link>
  )
}

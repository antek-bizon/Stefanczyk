import { Image } from '@chakra-ui/react'

export default function ExplorePage ({ images = [] }) {
  return (
    <>
      <h1>Explore</h1>
      {images.map((e, i) => {
        return <Image key={i} src={`http://localhost:3001/${e.url}`} alt={e.originalName} />
      })}
    </>
  )
}

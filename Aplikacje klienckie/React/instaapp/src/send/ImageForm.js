import './ImageForm.css'
import { useState } from 'react'

export default function ImageForm (clientToken) {
  const [selectedFile, setSelectedFile] = useState(null)

  const sendFile = async (e) => {
    e.preventDefault()

    const body = new FormData()
    body.append('file', selectedFile)
    body.append('album', 'smok241')

    try {
      const response = await fetch('http://localhost:3001/api/photos', {
        method: 'POST',
        body
        // headers: {
        //   'Content-Type': 'text/plain',
        //   Authorization: 'Bearer ' + clientToken
        // }
      })

      const result = await response.json()
      if (result.err) {
        console.error('Sending file went wrong')
        return
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <form className='image-form' onSubmit={(e) => sendFile(e)}>
      <h3>Choose file</h3>
      <input type='file' accept='image/*' onChange={(e) => setSelectedFile(e.target.files[0])} />
      <button type='submit'>Send</button>
    </form>
  )
}

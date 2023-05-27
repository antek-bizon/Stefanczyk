import { useState } from 'react'
import ImageForm from './send/ImageForm'
import UserValidation from './user/UserValidation'

function App () {
  const [clientToken, setClientToken] = useState('')
  const isClientToken = clientToken !== ''

  return (
    <main>
      <section>
        <UserValidation isToken={isClientToken} setToken={setClientToken} />
        {isClientToken && <ImageForm />}
      </section>
    </main>

  )
}

export default App

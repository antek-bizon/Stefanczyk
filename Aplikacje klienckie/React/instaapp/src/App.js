import { useState } from 'react'
import ImageForm from './send/ImageForm'
import UserValidation from './user/UserValidation'
import UserPage from './user/UserPage'

function App () {
  const [clientToken, setClientToken] = useState('')
  const isClientToken = clientToken !== ''

  return (
    <main>
      <section className={!isClientToken ? 'user-validation-bg' : ''}>
        {!isClientToken && <UserValidation setToken={setClientToken} />}
        {isClientToken && <ImageForm />}
        {isClientToken && <UserPage token={clientToken} />}
      </section>
    </main>

  )
}

export default App

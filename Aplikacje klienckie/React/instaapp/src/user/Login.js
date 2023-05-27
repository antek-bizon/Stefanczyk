import { useState } from 'react'

export default function Login ({ setToken }) {
  const [email, changeEmail] = useState('')
  const [password, changePassword] = useState('')

  const loginUser = async (e) => {
    e.preventDefault()
    const body = JSON.stringify({
      email,
      password
    })

    try {
      const response = await fetch('http://localhost:3001/api/user/login', {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      if (result.err || !result.data) {
        console.error('Login failed')
        return
      }

      setToken(result.data)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <form onSubmit={(e) => loginUser(e)} className='column'>
      <table className='user-validation-table'>
        <tbody>
          <tr>
            <td>E-mail</td>
            <td>
              <input type='text' required onChange={(e) => changeEmail(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td>Password</td>
            <td>
              <input type='password' required onChange={(e) => changePassword(e.target.value)} />
            </td>
          </tr>
        </tbody>
      </table>

      <button type='submit' className='submit-button'>Login</button>
    </form>
  )
}

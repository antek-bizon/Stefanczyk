import { useState } from 'react'

export default function Register () {
  const [email, changeEmail] = useState('')
  const [password, changePassword] = useState('')
  const [name, changeFirstName] = useState('')
  const [lastName, changeLastName] = useState('')

  const registerUser = async (e) => {
    e.preventDefault()
    const body = JSON.stringify({
      email,
      password,
      name,
      lastName
    })

    try {
      const response = await fetch('http://localhost:3001/api/user/register', {
        method: 'POST',
        body,
        headers: {
          // 'Content-Type': 'application/json'
          'Content-Type': 'text/plain'
        }
      })
      console.log(response)

      const result = await response.json()
      console.log(result)
      if (result.err || !result.data) {
        console.error('Register failed')
        window.alert('Register failed:\n' + result.msg)
        return
      }
      window.alert(result.data)
    } catch (e) {
      console.error(e)
      window.alert(e)
    }
  }

  return (
    <form onSubmit={(e) => registerUser(e)} className='column equal-height'>
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
          <tr>
            <td>First name</td>
            <td>
              <input type='text' required onChange={(e) => changeFirstName(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td>Last name</td>
            <td>
              <input type='text' required onChange={(e) => changeLastName(e.target.value)} />
            </td>
          </tr>
        </tbody>
      </table>

      <button type='submit' className='submit-button'>Register</button>
    </form>
  )
}

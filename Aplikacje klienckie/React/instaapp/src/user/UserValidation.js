import { useState } from 'react'
import Login from './Login'
import Register from './Register'

export default function UserValidation ({ isToken, setToken }) {
  const [switchState, changeSwitchState] = useState(true)

  // const widget = (switchState) ? <Login setToken={setToken} /> : <Register />

  return (
    <div className='userValidation column'>
      <div className='buttons'>
        <button
          className={
            (switchState) ? 'active' : 'inactive'
          }
          type='button' onClick={() => {
            if (!switchState) {
              changeSwitchState(true)
            }
          }}
        >Login
        </button>
        <button
          className={
            (!switchState) ? 'active' : 'inactive'
          }
          type='button' onClick={() => {
            if (switchState) {
              changeSwitchState(false)
            }
          }}
        >Register
        </button>
      </div>

      {(!isToken)
        ? (switchState) ? <Login setToken={setToken} /> : <Register />
        : 'Wyloguj'}
    </div>
  )
}

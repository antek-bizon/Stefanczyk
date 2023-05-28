import { useState } from 'react'
import Login from './Login'
import Register from './Register'

export default function UserValidation ({ setToken }) {
  const [switchState, changeSwitchState] = useState(true)

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

      {(switchState) ? <Login setToken={setToken} /> : <Register />}
    </div>
  )
}

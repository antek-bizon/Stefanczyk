import React from 'react'

export default function UserPage ({ token }) {
  // useEffect(() => {
  //   async function fetchData () {
  //     try {
  //       const response = await fetch('http://localhost:3001/api/profile', {
  //         method: 'GET',
  //         headers: {
  //           Authorization: 'Bearer ' + token
  //         }
  //       })

  //       const result = await response.json()
  //       console.log(result)
  //     } catch (e) {
  //       console.error(e)
  //     }
  //   }
  //   fetchData()
  // })

  return (
    <div>
      <h1>User Page</h1>
    </div>
  )
}

import './App.css'
import { useState, useEffect } from 'react'
import Board from './Board'

function App () {
  const [boards, setBoards] = useState('')
  const [color, setColor] = useState('')

  const radioOnChange = (e) => {
    setColor(e.target.value)
  }

  const renderBoards = () => {
    setColors(boards.map((e, i) => {
      return (
        <div key={i}>
          <input type='radio' name='colors' value={e.color} checked={colorInUse === e.color} onChange={radioOnChange} />
          <label>{e.color}</label>
        </div>
      )
    }))
    setBoards(boards.map((e, i) => {
      return <Board key={i} id={e.id} title={e.title} color={e.color} colorInUse={colorInUse} />
    }))
  }

  useEffect(() => {
    fetch('http://localhost:3001/colors', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setBoards(data.boards)
      })
  }, [])

  return (
    <div className='App'>
      <h1>Startujemy ze sprawdzianem</h1>
      <div className='row'>
        {colors}
      </div>
      <div className='row'>
        {boards}
      </div>
    </div>
  )
}

export default App

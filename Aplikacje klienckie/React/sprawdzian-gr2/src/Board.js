import { useState } from 'react'
import Row from './Row'

export default function Board ({ id, title, color, colorInUse }) {
  const width = 3
  const height = 6
  const rows = []
  for (let i = 0; i < height; i++) {
    rows.push(<Row key={i} width={width} colorInUse={colorInUse} />)
  }

  return (
    <div className='board' style={{ borderColor: color }}>
      <h2>{id}</h2>
      <h3>{title}</h3>
      <div className='column'>
        {rows}
      </div>
      <button onClick={() => { }}>Zapisz</button>
    </div>
  )
}

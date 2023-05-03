import { useState } from "react"

export default function Tile ({ colorInUse }) {
    const [isOn, changeState] = useState(false)
    const color = (isOn) ? colorInUse : ''
    console.log(colorInUse)

    return <div onClick={() => { changeState(!isOn) }}
        className="tile" style={{ backgroundColor: color }}></div>
}
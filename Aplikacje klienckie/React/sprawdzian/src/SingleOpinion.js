import Star from "./Star"
import { useState } from "react"

export default function SingleOpinion({ title }) {
    const resetStars = (val) => {
        const newStars = createStars(val)
        const newText = whatText(val)
        setStars(newStars)
        setText(newText)
    }

    const createStars = (val) => {
        const newStars = []
        for (let i = 0; i < 5; i++) {
            const isOn = i <= val
            newStars.push(<Star key={i} id={i} setStars={resetStars} isOn={isOn} />)
        }
        return newStars
    }

    const whatText = (val) => {
        switch (val) {
            case 0:
                return '1 - Zła'
            case 1:
                return '2 - Dopuszczajaca'
            case 2:
                return '3 - Dostateczna'
            case 3:
                return '4 - Dobra'
            case 4:
                return '5 - Bardzo dobra'
            default:
                return 'Błąd'
        }
    }

    const [stars, setStars] = useState(createStars(1))
    const [text, setText] = useState(whatText(1))

    return <div>
        <h3>{title}</h3>
        <div className="row">{stars}</div>
        <p>{text}</p>
    </div>
}
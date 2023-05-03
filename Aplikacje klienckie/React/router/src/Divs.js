import { useParams } from 'react-router-dom';
import { useState } from 'react'

export default function Divs() {
    let { id } = useParams()
    const initDivs = []

    for (let i = 0; i < id; i++) {
        initDivs.push({ id: id, value: i })
    }

    const [divs, changeDiv] = useState()

    const changeValue = (i) => {
        divs[i].value += 1
        changeDiv(() => { return [...divs] })
    }

    return <>
        {divs.map((e, i) => {
            return <div onClick={() => changeValue()}>
                <p>{i}</p>
                <p>{e.id}</p>
                <p>{e.value}</p>
            </div>
        })}
    </>
}
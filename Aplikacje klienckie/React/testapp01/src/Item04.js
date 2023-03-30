import Dialog from './Dialog'
import { useState } from 'react'

const Item4 = ({ val, obj, index, deleteSelected, update }) => {
    const [visibleDialog, visDialog] = useState(false)
    const changeVisibility = () => {
        visDialog(!visibleDialog)
    }

    const dialog = (visibleDialog) ? <Dialog index={index} deleteSelected={deleteSelected}
        changeVisibility={changeVisibility} /> : ''

    return <>
        <h2>{val}</h2>
        <button onClick={() => changeVisibility()}>usuń</button>
        <h3>{obj.value}</h3>
        <h3>{obj.array}</h3>
        <h3>{obj.object.a}, {obj.object.b}</h3>
        <button onClick={() => update(0)}>update 0</button>
        <button onClick={() => update(1)}>update 1</button>
        <button onClick={() => update(2)}>update 2</button>
        {dialog}
    </>
}

export default Item4
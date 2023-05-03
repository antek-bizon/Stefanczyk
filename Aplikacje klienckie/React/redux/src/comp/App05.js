import { add, removeFromStart, removeFromBack } from "../store/slices/TextSlice"
import { useDispatch, useSelector } from 'react-redux'

export default function App03() {
    const dispatch = useDispatch()
    const text = useSelector(state => state.text.value)

    return <div style={{ 'textAlign': 'center' }}>
        <h1>05</h1>
        <h2>text: {text}</h2>
        <button onClick={() => dispatch(add())}>Add</button>
        <button onClick={() => dispatch(removeFromStart())}>Remove from start</button>
        <button onClick={() => dispatch(removeFromBack())}>Remove from back</button>
    </div>
}
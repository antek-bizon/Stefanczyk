import { decrement, increment } from "../store/slices/CounterSlice"
import { useDispatch, useSelector } from 'react-redux'

export default function App04() {
    const dispatch = useDispatch()
    const counter = useSelector(state => state.counter.value)

    const items = []
    for (let i = 0; i < counter; i++) {
        items.push({ id: i + 1, name: 'item' })
    }

    return <div style={{ 'textAlign': 'center' }}>
        <h1>04 - ITEMS IN ARRAY</h1>
        <h2>conuter value: {counter}</h2>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button>
        {items.map(e => {
            return <div>{e.id} : {e.name}</div>
        })}
    </div>
}
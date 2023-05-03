import { decrement, increment } from "../store/slices/CounterSlice"
import { useDispatch, useSelector } from 'react-redux'

export default function App03() {
    const dispatch = useDispatch()
    const counter = useSelector(state => state.counter.value)

    return <div style={{ 'textAlign': 'center' }}>
        <h1>03 - DISPATCH ACTION</h1>
        <h2>conuter value: {counter}</h2>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button>
    </div>
}
import { update } from '../store/slices/FormSlice'
import { useDispatch, useSelector } from 'react-redux'

export default function App06() {
    const dispatch = useDispatch()
    const text = useSelector(state => state.text.value)

    return <div>
        <form>
            <input onChange={(e) => dispatch(update(e.target.value))} type={'text'} value={text} />
            <button onClick={() => { window.alert('simple form') }}>send</button>
            <div className='text'>
                {text.split(' ').map(word => {
                    return <div className='word'>
                        {word.split('').map(letter => {
                            return <div className='letter'>{letter}</div>
                        })}
                    </div>
                })}
            </div>

        </form>
    </div>
}
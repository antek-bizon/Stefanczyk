import './App.css';
import { useState } from 'react'
import Item1 from './Item01.js'
import Item2 from './Item02'
import Item3 from './Item03'
import Item4 from './Item04'

function App() {
  const [visible, setVisible] = useState(true)

  const setVis = (val) => {
    setVisible(val)
  }

  const init_arr = []
  const [arr, setList] = useState(init_arr)

  const addToEnd = () => {
    setList(() => {
      return [...arr, Math.floor(Math.random() * 1000)]
    })
  }

  const addToStart = () => {
    setList(() => {
      return [Math.floor(Math.random() * 1000), ...arr]
    })
  }

  const removeFromEnd = () => {
    setList(() => {
      return arr.slice(0, arr.length - 1)
    })
  }

  const removeFromStart = () => {
    setList(() => {
      return arr.slice(1)
    })
  }

  const removeAll = () => {
    setList(() => {
      return []
    })
  }

  const deleteSelected = (index) => {
    setList(() => {
      return arr.filter((e, i) => i !== index)
    })
  }

  const obj = {
    value: 1000,
    array: [1, 2, 3],
    object: { a: 1, b: 2 }
  }

  const [state, updateState] = useState(obj)
  const update = (val) => {
    switch (val) {
      case 0:
        updateState(() => {
          return {
            ...state,
            value: state.value + 100
          }
        })
        break
      case 1:
        updateState(() => {
          return {
            ...state,
            array: state.array.map((e) => { return e + 1 })
          }
        })
        break
      case 2:
        updateState(() => {
          return {
            ...state,
            object: { ...state.object, a: state.object.a + 1 }
          }
        })
        break
      default:
        break
    }
  }

  return (
    <div className="App">
      <Item1 />
      <Item2 title="ReactJS" info="easy" />
      <button onClick={() => setVis(true)}>visible</button>
      <button onClick={() => setVis(false)}>invisible</button>
      <Item3 visible={visible} />
      <div>
        <button onClick={() => addToEnd()}>dodaj na koniec</button>
        <button onClick={() => addToStart()}>dodaj na początek</button>
        <button onClick={() => removeFromStart()}>usuń z początku</button>
        <button onClick={() => removeFromEnd()}>usuń z końca</button>
        <button onClick={() => removeAll()}>usuń wszystko</button>
        {
          arr.map((element, i) => {
            return <Item4 key={i} val={element} obj={state} index={i}
              deleteSelected={deleteSelected} update={update} />
          })

        }
      </div>
    </div>
  );
}

export default App;

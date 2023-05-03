import './App.css';
import { useState } from 'react'
import Opinion from './Opinion';

function App() {
  const [opinions, setOpinions] = useState([])

  const data = {
    titles: ["Zgodność z opisem", 'Czas wysyłki', 'Koszt wysyłki', 'Obsługa kupującego']
  }

  const addOpinion = () => {
    console.log(opinions)
    const id = (opinions.length > 0) ? opinions[opinions.length - 1].props.id + 1 : 0
    console.log(id)
    setOpinions(() => { return [...opinions, <Opinion key={id} id={id} titles={data.titles} deleteSelf={deleteOpinion} />] })

  }

  const deleteOpinion = (id) => {
    console.log(opinions)
    console.log('lenght', opinions.length)
    setOpinions(() => { return opinions.filter(opi => opi.props.id !== id) })
  }

  return (
    <div className="App">
      <h1>Sprawdzian React - opinie na allegro</h1>
      <button onClick={() => addOpinion()}>Dodaj opinie</button>
      {opinions}
    </div>
  );
}

export default App;

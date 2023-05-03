import { useParams } from 'react-router-dom';

export default function Buttons() {
    let { id } = useParams()
    const buttons = []

    const alert = (index, id) => { window.alert(`index: ${index} id: ${id}`) }

    for (let i = 0; i < id; i++) {
        buttons.push(<button onClick={() => alert(i, id)}>Przycisk {i}</button>)
    }
    return <>
        {buttons}
    </>
}
import { useParams } from 'react-router-dom';

export default function Child() {
    let { id } = useParams()
    return <h1>
        Child Page - params: {id}
    </h1>
}
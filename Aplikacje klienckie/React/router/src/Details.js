import { useParams } from "react-router-dom"


export default function Details() {
    const { id } = useParams()
    return <h3>Earl grey - {id}</h3>
}
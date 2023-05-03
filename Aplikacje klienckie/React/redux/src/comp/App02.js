import { useSelector } from "react-redux";

export default function App01() {
    const arrayVal = useSelector((state) => state.arrayVal.value1)
    const objectVal = useSelector((state) => state.objectVal.value1)
    const arrayOfObjectsVal = useSelector((state) => state.arrayOfObjectsVal.value1)


    console.log(arrayVal)
    console.log(objectVal)
    console.log(arrayOfObjectsVal)

    return <div>
        {arrayVal.map(e => { return <h2>{e}</h2> })}
        {arrayOfObjectsVal.map(e => { return <h3>{e.id}</h3> })}
    </div>
}
import { useSelector } from "react-redux";

export default function App01() {
    const value = useSelector((state) => state.testValue.value1)

    console.log(value)

    return (
        <h1>{value}</h1>
    )
}
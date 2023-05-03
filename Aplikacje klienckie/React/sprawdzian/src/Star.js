export default function Star({ id, setStars, isOn }) {
    const style = (isOn) ? 'yellow' : ''

    return <>
        <div className="star" style={{ backgroundColor: style }} onClick={() => setStars(id)}></div>
    </>

}
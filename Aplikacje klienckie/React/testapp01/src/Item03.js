
const Item3 = ({ visible }) => {
    const display = (visible) ? 'visible' : 'invisible'

    return <div className={display}>
        <h1>Item 03</h1>
    </div>
}

export default Item3
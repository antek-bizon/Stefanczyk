import Tile from "./Tile"

export default function Row ({ width, colorInUse }) {
    const tiles = []
    for (let i = 0; i < width; i++) {
        tiles.push(<Tile key={i} colorInUse={colorInUse} />)
    }
    return <div className="row">
        {tiles}
    </div>
}
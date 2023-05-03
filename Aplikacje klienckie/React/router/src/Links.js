import { Link } from "react-router-dom"

export default function Links() {
    const links = new Array(50)
    for (let i = 0; i < links.length; i++) {
        links[i] = <Link to={"/" + i}>Param {i}</Link>
    }
    return <div>
        {links}
    </div>
}
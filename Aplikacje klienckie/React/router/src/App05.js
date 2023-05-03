import React from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Divs from "./Divs"

export default function App() {
    const links = [7, 3, 5, 6, 10, 20, 2, 1, 11]
    return <div>
        <Router>
            {links.map(e => { return <Link to={"/" + e}>{e}</Link> })}
            <Routes>
                <Route path="/:id" element={<Divs />} />
                <Route path="*" element={<h2>Path not found</h2>} />
            </Routes>
        </Router>
    </div>
}
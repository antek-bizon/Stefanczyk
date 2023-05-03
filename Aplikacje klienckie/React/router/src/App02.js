import React from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Child from "./Child"
import Home from './Home'
import Details from './Details'

export default function App() {
    return <div>
        <Router>

            <Link to="/1">param = 1</Link>
            <Link to="/2">param = 2</Link>
            <Link to="/3">param = 3</Link>

            <Routes>
                <Route path="/:id" element={<Child />} />
            </Routes>

        </Router>
        <Router>

            <Link to="/">Home</Link>
            <Link to="/details">Details</Link>
            <Link to="/details/1">Details/1</Link>
            <Link to="/details/2">Details/2</Link>


            <Routes>
                <Route path="/details/:id" element={<Details />} />
                <Route path="/details" element={<Details />} />
                <Route path="/" element={<Home />} />
            </Routes>

        </Router>

    </div>
}
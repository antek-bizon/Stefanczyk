import React from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Home from "./Home"
import About from './About'

export default function App() {
    return <div>
        <Router>
            <Link to='/'>Home</Link>
            <Link to='/about'>About</Link>

            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/about" element={<About />} />
            </Routes>
        </Router>
    </div>
}
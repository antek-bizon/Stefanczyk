import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Buttons from "./Buttons"

export default function App() {
    return <div>
        <Router>
            <Routes>
                <Route path="/:id" element={<Buttons />} />
                <Route path="*" element={<h2>Path not found</h2>} />
            </Routes>
        </Router>
    </div>
}
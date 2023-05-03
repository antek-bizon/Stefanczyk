import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Child from "./Child"
import Links from './Links'

export default function App() {
    return <div>
        <Router>
            <Links />

            <Routes>
                <Route path="/:id" element={<Child />} />
                <Route path="*" element={<h2>Path not found</h2>} />
            </Routes>
        </Router>
    </div>
}
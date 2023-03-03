const express = require("express")
const app = express()
const PORT = 3000

app.get("/", function (req, res) {
    let count = req.query.count
    let color = req.query.bg
    let file = []
    for (let i = 0; i < count; i++) {
        file.push(`<div style="background-color: ${color}; width: 100px; height: 100px; margin: 20px; text-align: center;"> ${i+1} </div>`)
        
    }
    res.send(file.join(""))
})

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
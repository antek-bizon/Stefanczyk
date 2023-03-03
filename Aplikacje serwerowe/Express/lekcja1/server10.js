const express = require("express")
const app = express()
const PORT = 3000

app.get("/", function (req, res) {
    let value = req.query.value
    let toRad = req.query.toRad

    if (toRad) {

    } else {
        
    }
})

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
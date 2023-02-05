const express = require("express")
const app = express()
const PORT = 3000
const path = require("path")

app.use(express.static("static"))

app.get("/koty", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/koty.html"))
})

app.get("/auta", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/auta.html"))
})

app.get("/drzewa", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/drzewa.html"))
})

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
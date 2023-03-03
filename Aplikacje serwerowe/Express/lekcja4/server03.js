const express = require("express")
const app = express()
const PORT = 3000
const path = require("path")

app.use(express.json())

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index3.html"))
})

app.post("/api", function (req, res) {
    console.log(req.body)
    res.setHeader("Content-Type", "application/json")
    res.send(JSON.stringify(req.body))
})

app.use(express.static("static"))

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
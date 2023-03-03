const express = require("express")
const app = express()
const PORT = 3000
const path = require("path")
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))
})

app.post("/handlePost" ,function (req, res) {
    console.log(req.body)
    res.setHeader("content-type", "application/json")
    res.send(req.body)
})
// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
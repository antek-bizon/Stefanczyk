const express = require("express")
const app = express()
const PORT = 3000
const path = require("path")
const bodyParser = require("body-parser")

app.use(express.json())

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index4.html"))
})

app.post("/handlePost" ,function (req, res) {
    console.log(req.body)
    let val = req.body.val * 5
    res.setHeader("content-type", "application/json")
    res.send({val: val})
})
// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
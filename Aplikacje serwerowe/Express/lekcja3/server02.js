const express = require("express")
const app = express()
const PORT = 3000
const path = require("path")
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true })); 

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index2.html"))
})

app.post("/handlePost", function (req, res) {
    let a = parseInt(req.body.a)
    let b = parseInt(req.body.b)
    req.body.sum = a + b
    req.body.ilo = a * b
    req.body.btn1 = "wyslij"
    res.setHeader("Content-Type", "application/json")
    res.send(JSON.stringify(req.body, null, 5))
})

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
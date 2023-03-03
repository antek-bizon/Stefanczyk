const express = require("express")
const app = express()
const PORT = 3000
const path = require("path")
const bodyParser = require("body-parser")

app.use(express.json())

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index3.html"))
})

app.post("/post", function (req, res) {
    console.log(req.body)
    let num1 = parseInt(req.body.a)
    let num2 = parseInt(req.body.b)
    let sum = num1 + num2
    let ilo = num1 * num2
    let obj = {
        suma: sum,
        iloczyn: ilo,
    }
    console.log(obj)
    res.setHeader("Content-Type", "text/plain")
    res.send(obj)
})

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
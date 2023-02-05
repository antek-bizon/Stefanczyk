const express = require("express")
const app = express()
const PORT = 3000
const path = require("path")

//app.use(express.static('static'))

app.get("/", function (req, res) {
    console.log("/")

    res.sendFile(path.join(__dirname + "/static/formularz.html"))
})

app.get("/handleForm", function (req, res) {
    console.log(req.query.color)
    const fileString = `<html><body style="background-color: ${req.query.color}; text-align: center;">${req.query.color}</body></html>"`
    res.send(fileString)
})

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
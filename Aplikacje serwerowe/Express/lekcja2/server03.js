const express = require("express")
const app = express()
const PORT = 3000
const path = require("path")
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function (req, res) {
    console.log("/")

    res.sendFile(path.join(__dirname + "/static/formularz-post.html"))
})

app.post("/handleForm", function (req, res) {
    console.log(req.body)

    const fileString = `<html><body style="background-color: ${req.body.color}; text-align: center;">${req.body.color}</body></html>"`
    res.send(fileString)
})

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
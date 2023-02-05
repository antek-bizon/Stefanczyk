const express = require("express")
const app = express()
const PORT = 3000
const path = require("path")
const formidable = require("formidable")

app.use(express.json())

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))
})

app.post("/handleUpload", function (req, res) {
    let form = formidable({})
    form.keepExtensions = true
    
    form.uploadDir = __dirname + "/static/upload/"

    form.parse(req, function (err, fields, files) {
        console.log("----- przesłane pola z formularza ------");

        console.log(fields);

        console.log("----- przesłane formularzem pliki ------");

        console.log(files);

        const json = [fields, files]
        res.setHeader("Content-Type", "application/json")

        res.send(JSON.stringify(json, null, 3))
    })
})

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
const express = require('express')
const app = express()
const PORT = 3000
const path = require('path')
const fs = require('fs')

app.use(express.json())

app.get('/', function (req, res) {
    res.send(path.join(__dirname + '/static/index.html'))
})

app.post('/cwiczenia', function (req, res) {
    fs.readdir(path.join(__dirname + '/static/cwiczenia'), function (err, files) {
        if (err) {
            return console.log(err);
        }
        const jsonFiles = JSON.stringify(files)
        console.log(jsonFiles)
        res.setHeader('Content-Type', 'application/json')
        res.send(jsonFiles, null, 3)
    });
})

app.use(express.static('static'))
app.use(express.static('static/cwiczenia'))

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
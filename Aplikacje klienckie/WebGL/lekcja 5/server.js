const express = require('express')
const app = express()
const PORT = 3000
const path = require('path')

app.use(express.json())

let data = {}

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'))
})

app.post('/config', function (req, res) {
    if (req.body.request == 0) {
        res.send(JSON.stringify({response: data}))
        return
    }
    data = req.body.request
    res.setHeader('content-type', 'application/json')
    res.send(JSON.stringify({response: 0}))
})

app.get('/game', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/game.html'))
})

app.post('/game-data', function (req, res) {
    res.setHeader('content-type', 'application/json')
    res.send(JSON.stringify({request: data}))
})

app.use(express.static('static'))

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
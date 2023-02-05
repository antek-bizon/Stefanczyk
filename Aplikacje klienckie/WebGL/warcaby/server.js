const express = require('express')
const app = express()
const PORT = 3000
const path = require('path')

app.use(express.json())

players = []

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'))
})

app.post('/addPlayer', function (req, res) {
    for (let i = 0; i < players.length; i++) {
        if (req.body.name === players[i]) {
            res.send(JSON.stringify({ err: true, msg: `Already exists: ${req.body.name}` }))
            return
        }
    }

    players.push(req.body.name)

    res.send(JSON.stringify({ err: false, msg: players.length }))
})

app.post('/resetPlayers', function (req, res) {
    players.length = 0
    res.send(JSON.stringify({ err: false }))
})

app.post('/numberOfPlayers', function (req, res) {
    console.log(players.length)
    res.send(JSON.stringify({ number: players.length }))
})

app.use(express.static('static'))

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
const express = require('express')
const app = express()
const PORT = 3001

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.all('/colors', function (req, res) {
    console.log('colors')
    const data = {
        boards: [
            {
                id: 111,
                title: "plansza AAA",
                color: "#ff0000"
            },
            {
                id: 222,
                title: "plansza BBB",
                color: "#00ff00"
            },
            {
                id: 555,
                title: "plansza CCC",
                color: "#0000ff"
            },
            {
                id: 888,
                title: "plansza DDD",
                color: "#ffff00"
            },
        ]
    }
    res.setHeader('content-type', 'application/json')
    res.send(JSON.stringify(data))
})

app.listen(PORT, function () {
    console.log('Start na porcie', PORT)
})
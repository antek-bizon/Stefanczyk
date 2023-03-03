const express = require("express")
const app = express()
const PORT = 3000

app.get("/", function (req, res) {
    console.log(req.query)
    console.log(req.query.p1)
    res.send(req.query)
})

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
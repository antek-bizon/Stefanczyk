const express = require("express")
const app = express()
const PORT = 3000

app.get("/", function (req, res) {
    res.send("dane html odesłane z serwera do przeglądarki")
})

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
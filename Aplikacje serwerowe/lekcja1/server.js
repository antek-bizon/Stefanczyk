const express = require("express")
const app = express()
const PORT = 3000

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
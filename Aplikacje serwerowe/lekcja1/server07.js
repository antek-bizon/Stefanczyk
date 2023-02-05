const express = require("express")
const app = express()
const PORT = 3000

app.get("/", function (req, res) {
   res.status(404).send("brak strony takiego produktu")
})

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
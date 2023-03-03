const express = require("express")
const app = express()
const PORT = 3000

app.get("/user/:id", function (req, res) {
    let id = req.params.id
    if (id == 2) {
        res.send("odsyłam stronę usera z id = 2")
    } else {
        res.send("taaki user nie istnieje")
    }
})

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
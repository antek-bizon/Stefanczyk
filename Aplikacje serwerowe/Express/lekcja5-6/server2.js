const express = require('express')
const app = express()
const PORT = 3000
const path = require('path')
const hbs = require('express-handlebars')

const context = {
    subject: "ćwiczenie 2 - podstawowy context",
    content: "to jest TREŚĆ mojej strony",
    footer: "to jest stopka na mojej stronie"
}

app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }))
app.set('view engine', 'hbs')

app.get('/', function (req, res) {
    res.render('index2.hbs', context)
})

app.use(express.static('static'))

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
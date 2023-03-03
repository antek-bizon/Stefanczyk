const express = require('express')
const app = express()
const PORT = 3000
const path = require('path')
const hbs = require('express-handlebars')

const context = require('./data/data11.json')
console.log(context)

app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: 'views/partials'
}))
app.set('view engine', 'hbs')

app.get('/', function (req, res) {
    res.render('index11.hbs', context)
})

app.use(express.static('static'))

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
const express = require('express')
const app = express()
const PORT = 3000
const path = require('path')
const hbs = require('express-handlebars')

const context = require('./data/data10.json')
console.log(context)

app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    helpers: {
        shortTitle: function (title) {
            return title.substring(0, 10) + "..."
        },
        bigChungus: function (title) {
            const input = title.split(" ")
            const output = []
            input.forEach(e => {
                let tmp = e.split("")
                tmp[0] = tmp[0].toUpperCase()
                output.push(tmp.join(""))
            });
            
            return output.join(" ")
        },
        dashedWords: function (title) {
            const input = title.split(" ")
            const output = []

            input.forEach(e => {
                const tmp = e.split("")
                output.push(tmp.join("-"))
            })

            return output.join(" ")
        }
    }
}))
app.set('view engine', 'hbs')

app.get('/', function (req, res) {
    res.render('index10.hbs', context)
})

app.get('/handle', function (req, res) {
    const newContext = context
    console.log(req.query)
    newContext.title = req.query.input
    res.render('index10.hbs', newContext)
})

app.use(express.static('static'))

// Nasłuchiwanie
app.listen(PORT, function () {
    console.log("Start serwera na porcie: " + PORT)
})
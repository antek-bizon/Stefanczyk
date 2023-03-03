const express = require('express')
const app = express()
const PORT = 3000
const path = require('path')
const hbs = require('express-handlebars')
const Datastore = require('nedb')

const coll = new Datastore({
  filename: 'db-kolecja/kolekcja2.db',
  autoload: true
})

const context = { types: ['ubezpieczony', 'benzyna', 'uszkodzony', 'napęd 4x4'] }

app.use(express.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.engine('hbs', hbs({
  extname: '.hbs',
  partialsDir: 'views/partials'
}))

app.get('/', function (req, res) {
  coll.find({}, function (err, docs) {
    context.docs = docs
    console.log(context.docs)
    res.render('index.hbs', context)
  })
})

app.post('/add', function (req, res) {
  const data = {
    ubezpieczony: (req.body.ubezpieczony) ? 'TAK' : 'NIE',
    benzyna: (req.body.benzyna) ? 'TAK' : 'NIE',
    uszkodzony: (req.body.uszkodzony) ? 'TAK' : 'NIE',
    napęd_4x4: (req.body['napęd 4x4']) ? 'TAK' : 'NIE'
  }
  console.log(data)

  coll.insert(data, function (err, doc) {
    console.log(doc)
    res.redirect('/')
  })
})

app.use(express.static('static'))

// Nasłuchiwanie
app.listen(PORT, function () {
  console.log('Start serwera na porcie: ' + PORT)
})

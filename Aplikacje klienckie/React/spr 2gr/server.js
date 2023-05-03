const express = require('express')
const path = require('path')
const data = require('./data.json')
const app = express()
const PORT = 3000

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  next()
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/data', (req, res) => {
  res.send(JSON.stringify(data, null, 5))
})

app.listen(PORT, () => {
  console.log('start na porcie', PORT)
})

const express = require('express')
// const cors = require('cors')
const app = express()
const PORT = 8082

const users = new Map()

// app.use(cors)

// Nasłuchiwanie
app.listen(PORT, function () {
  console.log('Start serwera na porcie: ' + PORT)
})

app.get('/api/users', (_req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const body = Array.from(users.entries())
  res.send(JSON.stringify({ body }))
})

app.post('/api/register', express.json(), (req, res) => {
  console.log(req.body)
  if (!req.body || !req.body.name || !req.body.password) {
    return res.status(400).send('Invalid data')
  }

  if (users.has(req.body.name)) {
    return res.status(403).send('User already exists')
  }

  users.set(req.body.name, {
    login: req.body.name,
    password: req.body.password,
    date: Date.now()
  })

  res.send('User has been registered')
})

app.delete('/api/users', express.json(), (req, res) => {
  console.log(req.body)
  if (!req.body || !req.body.name) {
    return res.status(400).send('Invalid data')
  }

  if (users.delete(req.body.name)) {
    return res.send('Users has been deleted')
  } else {
    return res.status(403).send("Users doesn't exists")
  }
})

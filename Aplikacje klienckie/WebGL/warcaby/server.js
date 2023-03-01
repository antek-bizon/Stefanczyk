const express = require('express')
const app = express()
const PORT = 3000
const path = require('path')
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const socketio = new Server(server)

app.use(express.json())

const players = new Map()
let currentTurn = null
let interval = null

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'static', 'index.html'))
})

app.post('/addPlayer', function (req, res) {
  for (let i = 0; i < players.length; i++) {
    if (req.body.name === players[i]) {
      res.send(JSON.stringify({ err: true, msg: `Already exists: ${req.body.name}` }))
      return
    }
  }

  players.push(req.body.name)

  res.send(JSON.stringify({ err: false, msg: players.length }))
})

app.post('/resetPlayers', function (req, res) {
  console.log('resetPlayers')
  currentTurn = null
  players.forEach((v, k) => {
    k.emit('gameEnd', {})
    k.disconnect(true)
  })
  players.clear()
  res.send(JSON.stringify({ err: false }))
})

// app.post('/numberOfPlayers', function (req, res) {
//   console.log(players.size)
//   res.send(JSON.stringify({ number: players.size }))
// })

function removeClient (client) {
  if (players.has(client)) {
    players.delete(client)
  }
  client.disconnect(true)
}

function endGame (winner) {
  players.forEach((v, k) => {
    if (!winner) {
      winner = (v.id === 1) ? 'white' : 'red'
    }
    k.emit('gameOver', {
      winner
    })
    removeClient(k)
  })

  currentTurn = null

  if (interval) {
    clearInterval(interval)
  }
}

function turnTimer () {
  if (interval) {
    clearInterval(interval)
  }

  console.log('turnTimer')

  const timer = Date.now()
  const seconds = 31
  interval = setInterval(() => {
    const d = Date.now()

    console.log(seconds * 1000 + (timer - d))
    if (seconds * 1000 + (timer - d) < 0) {
      let winner = ''
      if (currentTurn === 'red') {
        winner = 'white'
      } else {
        winner = 'red'
      }
      // Endgame
      endGame(winner)
    }
  }, 1000)
}

socketio.on('connection', (client) => {
  console.log('klient się podłączył z id = ', client.id)

  if (currentTurn) {
    client.emit('gameAlreadyStarted')
    removeClient(client)
  }

  if (players.size < 2) {
    players.set(client, '')

    client.emit('onconnect', {
      res: client.id
    })
  } else {
    console.log(players.size)
    client.emit('toManyPlayers')
    removeClient(client)
  }

  client.on('login', (data) => {
    let found = false
    for (const [key, value] of players) {
      if (data.res === value) {
        found = true
        break
      }
    }

    if (!found) {
      players.set(client, { name: data.res, id: players.size })
      // Start game
      if (players.size > 1) {
        currentTurn = 'white'
        let i = 0
        players.forEach((v, k) => {
          k.emit('start', {
            nr: i++
          })

          turnTimer()

          k.on('makeMove', (data) => {
            console.log('makeMove')
            if (currentTurn === 'white') {
              currentTurn = 'red'
            } else if (currentTurn === 'red') {
              currentTurn = 'white'
            }

            turnTimer()

            players.forEach((v, k2) => {
              console.log('nextMove')
              k2.emit('nextMove', {
                nowMoves: currentTurn,
                dataToSend: data.dataToSend
              })
            })
          })

          k.on('noPieces', (data) => {
            const winner = (data.id === 'red') ? 'white' : 'red'
            endGame(winner)
          })
        })
      }
    } else {
      client.emit('failedLogin', {
        res: `Already exists: ${data.res}`
      })
      removeClient(client)
    }
  })

  client.on('disconnect', (reason) => {
    console.log('klient się rozłącza', reason)
    if (players.has(client)) {
      players.delete(client)
      endGame()
    }
  })
})

app.use(express.static('static'))

// Nasłuchiwanie
server.listen(PORT, function () {
  console.log('Start serwera na porcie: ' + PORT)
})

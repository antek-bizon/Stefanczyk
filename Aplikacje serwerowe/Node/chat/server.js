const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const logger = require('tracer').colorConsole()
const PORT = 3000
const { Server } = require('socket.io')

const staticFolders = ['static']

const server = http.createServer((req, res) => {
  console.log(`żądany przez przeglądarkę adres: ${req.url}`)

  const file = searchForFile(req.url)

  if (file) {
    res.writeHead(200, {
      'Content-Type': `${file.type};charset=utf-8`
    })
    res.write(file.data)
    res.end()
  } else {
    logger.warn('Page was not found:', req.url)
    const filepath = path.join(__dirname, 'error', 'index.html')
    if (fs.existsSync(filepath)) {
      fs.readFile('error/index.html', function (err, data) {
        if (err) throw err
        res.writeHead(200, {
          'Content-Type': 'text/html;charset=utf-8'
        })
        res.write(data)
        res.end()
      })
    } else {
      res.writeHead(404)
      res.end()
    }
  }
})

function searchForFile (url) {
  url = decodeURIComponent(url)
  if (url === '/') {
    url = '/index.html'
  }
  for (let i = 0; i < staticFolders.length; i++) {
    const filepath = path.join(__dirname, staticFolders[i], url)
    if (fs.existsSync(filepath)) {
      const data = fs.readFileSync(filepath)
      const type = mime.lookup(filepath)
      return {
        type,
        data
      }
    }
  }
  return false
}

const socketio = new Server(server)
const names = new Map()

socketio.on('connection', (client) => {
  logger.info('New client connected', client.id)

  client.emit('onconnect', {
    clientId: client.id
  })

  let name = ''

  client.on('myName', (data) => {
    const found = names.has(data.usrName)
    if (!found) {
      name = data.usrName
      names.set(data.usrName, client.id)
      socketio.emit('newUsr', {
        usrName: data.usrName,
        time: Date.now()
      })
    } else {
      client.emit('incorrectName', {})
    }
  })

  client.on('sendMessage', (data) => {
    socketio.emit('newMessage', {
      sender: data.usrName,
      msg: data.msg,
      time: Date.now()
    })
  })

  client.on('disconnect', (reason) => {
    logger.info('Client has disconnected', client.id, name)
    if (name) {
      names.delete(name)
      socketio.emit('usrDisconn', {
        usrName: name,
        time: Date.now()
      })
    }
  })
})

server.listen(PORT, () => {
  console.log(`serwer startuje na porcie ${PORT}`)
})

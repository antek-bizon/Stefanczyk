const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const logger = require('tracer').colorConsole()
const PORT = 3000
const process = require('process')
const Datastore = require('nedb')
const db = new Datastore({ filename: 'db/col.db', autoload: true })

const staticFolders = ['static']
const routes = new Map()
routes.set('/', 'index.html')
routes.set('/startStats', trackHeap)
routes.set('/getStats', getHeapStats)

let interval = null

const server = http.createServer(async (req, res) => {
  console.log(`żądany przez przeglądarkę adres: ${req.url}`)

  switch (req.method) {
    case 'GET':
      handleGet(req, res)
      break
    case 'POST':
      if (!await handlePost(req, res)) {
        sendError(res)
      }
      break
    default:
      logger.warn('Method not handled')
      sendError(res)
      break
  }
})

function handleGet(req, res) {
  const file = searchForFile(req.url)

  if (file) {
    res.writeHead(200, {
      'Content-Type': `${file.type};charset=utf-8`
    })
    res.write(file.data)
    res.end()
  } else {
    logger.warn('Page was not found:', req.url)
    sendError(res, true)
  }
}

function sendError(res, errorPage) {
  const filepath = path.join(__dirname, 'error', 'index.html')
  if (errorPage && fs.existsSync(filepath)) {
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

function searchForFile(url) {
  url = decodeURIComponent(url)
  if (routes.has(url)) {
    url = routes.get(url)
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

async function handlePost(req, res) {
  if (routes.has(req.url)) {
    const func = routes.get(req.url)
    await func(req, res)
    return true
  }
  return false
}

function trackHeap() {
  if (interval) {
    clearInterval(interval)
  }
  let i = 0
  interval = setInterval(() => {
    console.log(process.memoryUsage().heapTotal)
    console.log(process.memoryUsage().heapUsed)
    const newRec = {
      id: i++,
      time: Date.now(),
      total: process.memoryUsage().heapTotal,
      used: process.memoryUsage().heapUsed
    }
    db.insert(newRec, function (err) {
      if (err) throw err
    })
  }, 500)
}

function getHeapStats() {
  db.count({}, (err, n) => {
    if (err) throw err
    db.find({}).sort({ time: 1 }).skip(n - 20).limit(20).exec((err2, docs) => {
      if (err2) throw err2
      console.log(docs)
    })
  })
}

server.listen(PORT, () => {
  console.log(`serwer startuje na porcie ${PORT}`)
})

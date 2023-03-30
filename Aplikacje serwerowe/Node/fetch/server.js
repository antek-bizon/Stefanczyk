const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const logger = require('tracer').colorConsole()
const PORT = 3000

const staticFolders = ['static']
const routes = new Map()
routes.set('/', 'index.html')
routes.set('/color', handleColor)

const server = http.createServer((req, res) => {
  console.log(`żądany przez przeglądarkę adres: ${req.url}`)

  switch (req.method) {
    case 'GET':
      handleGet(req, res)
      break
    case 'POST':
      if (!handlePost(req, res)) {
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

function handlePost(req, res) {
  if (routes.has(req.url)) {
    const func = routes.get(req.url)
    func(req, res)
    return true
  }
  return false
}

function handleColor(req, res) {
  let body = "";

  req.on("data", function (data) {
    body += data.toString();
  })

  req.on("end", function (data) {
    const params = new URLSearchParams(body);
    res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
    res.end(body);
  })
}

server.listen(PORT, () => {
  console.log(`serwer startuje na porcie ${PORT}`)
})

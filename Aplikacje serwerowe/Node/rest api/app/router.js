const path = require('path')
const fs = require('fs')
const logger = require('tracer').colorConsole()
const mime = require('mime-types')
const controller = require('./controller')
const { createError, createSuccesful } = require('./controller')
const routes = setRoutes()
const staticFolders = ['static']

const router = async (req, res) => {
  console.log('żądany przez przeglądarkę adres:', req.url)
  console.log('metoda:', req.method)

  switch (req.method) {
    case 'GET':
      handleGet(req, res)
      break
    case 'POST':
      handlePost(req, res)
      break
    case 'PUT':
      break
    case 'DELETE':
      break
    default:
      logger.warn('Method not handled')
      sendError(res)
      break
  }
}

module.exports = router

function setRoutes() {
  const routes = {
    get: new Map(),
    post: new Map(),
    put: new Map(),
    delete: new Map()
  }
  routes.get.set('/api/tasks', controller.getAll)
  routes.get.set('/api/tasks/?', controller.getOne)
  routes.post.set('/api/tasks', controller.add)
  routes.put.set('/api/tasks', controller.update)
  routes.delete.set('/api/tasks/?', controller.delete)
  return routes
}

function handleUrlRoutes(url, method = 'get') {
  url = decodeURIComponent(url)
  if (routes[method].has(url)) {
    return { func: routes[method].get(url) }
  } else if (url.match(/\/api\/tasks\/([0-9]+)/)) {
    const checkMap = url.substring(0, url.lastIndexOf('/')) + '/?'
    if (routes[method].has(checkMap)) {
      const id = url.substring(url.lastIndexOf('/') + 1)
      return { func: routes[method].get(checkMap), id }
    }
  }
  return url
}

function tryToReadFile(handle) {
  for (let i = 0; i < staticFolders.length; i++) {
    const filepath = path.join(__dirname, '..', staticFolders[i], handle)
    console.log(filepath)
    if (fs.existsSync(filepath)) {
      const data = fs.readFileSync(filepath)
      const type = mime.lookup(filepath)
      return createSuccess(type, data)
    }
  }
  return createError('File not found')
}

function searchForFile(url) {
  const handle = handleUrlRoutes(url)
  if (typeof handle === "string") {
    return tryToReadFile(handle)
  }
  if (typeof handle.func === "function") {
    return handle.func((handle.id) ? handle.id : undefined)
  }

  return false
}

function handleGet(req, res) {
  const file = searchForFile(req.url)

  if (file) {
    res.writeHead(file.status, {
      'Content-Type': `${file.type};charset=utf-8`
    })
    res.write(file.data)
    res.end()
  } else {
    logger.warn('Page was not found:', req.url)
    sendError(res, true)
  }
}

function handlePost(req, res) {
  const handle = handleUrlRoutes(req.url, 'post')
  console.log(req.url.match(/\/api\/tasks\/([0-9]+)/))
  if (typeof handle.func === "function") {
    handle.func(req, res)
  } else {
    sendError(res)
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
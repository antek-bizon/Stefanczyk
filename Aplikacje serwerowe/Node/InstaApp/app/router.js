const logger = require('tracer').colorConsole()
const controller = require('./controller')
const routes = setRoutes()
const matchingRoutes = setMatchingRoutes()

controller.deleteAllImages()

const router = (req, res) => {
  logger.log('żądany przez przeglądarkę adres:', req.url)
  logger.log('metoda:', req.method)

  const method = req.method.toLowerCase()
  const url = decodeURIComponent(req.url)

  const cookies = new Map()
  if (req.headers.cookie) {
    req.headers.cookie.split('; ').forEach(cookie => {
      const [key, value] = cookie.split('=')
      cookies.set(key, value)
    })
  }

  if (!cookies.get('token')) {
    logger.log('No token found')
  }

  controller.setHeaders({ res, origin: req.headers.origin })

  if (method === 'options') {
    return controller.sendOptions({ res })
  }

  if (!routes[method]) {
    logger.warn('Method not handled')
    controller.sendError({ res })
    return
  }

  const methodFunctions = routes[method]
  if (methodFunctions[url]) {
    const func = methodFunctions[url]
    return func({ res, req })
  }
  const checkMap = url.substring(0, url.lastIndexOf('/')) + '/?'
  logger.log(checkMap)
  if (methodFunctions[checkMap]) {
    const func = methodFunctions[checkMap]
    const query = url.substring(url.lastIndexOf('/') + 1)
    return func({ res, req, query })
  }

  for (const route of matchingRoutes) {
    if (route.matcher.test(url)) {
      const queryArr = url.split('/').slice(-route.numOfParams)
      const func = route.func
      return func({ res, queryArr })
    }
  }

  logger.warn('No routes founded, trying to send file')
  return controller.sendFile({ res, url })
}

module.exports = router

function setRoutes () {
  const routes = {
    get: getRoutes(),
    post: postRoutes(),
    patch: patchRoutes(),
    delete: deleteRoutes()
  }
  return routes
}

function getRoutes () {
  return {
    '/api/photos': controller.getAllImagesJSON,
    '/api/photos/?': controller.getOneImageJSON,
    '/api/tags/raw': controller.getAllTags,
    '/api/tags': controller.getAllTagsObjects,
    '/api/tags/?': controller.getOneTag,
    '/api/photos/tags/?': controller.getImageTags,
    '/api/filters/metadata/?': controller.getImageMetadata,
    '/api/getfile/?': controller.getImage,
    '/api/user/confirm/?': controller.confirmUser,
    '/api/profile': controller.getUserData
  }
}

function postRoutes () {
  return {
    '/api/photos': controller.addImage,
    '/api/tags': controller.addTag,
    '/api/user/register': controller.registerUser,
    '/api/user/login': controller.loginUser
  }
}

function patchRoutes () {
  return {
    '/api/photos': controller.updateImage,
    '/api/photos/tags': controller.addOneTagToImage,
    '/api/photos/tags/multi': controller.addMultiTagsToImage,
    '/api/filters': controller.applyFilter,
    '/api/profile': controller.updateUserData
  }
}

function deleteRoutes () {
  return {
    '/api/photos/?': controller.deleteImage
  }
}

function setMatchingRoutes () {
  return [
    {
      method: 'get',
      matcher: /\/api\/getfile\/[0-9]+\/[a-zA-Z]+/,
      numOfParams: 2,
      func: controller.getImageWithFilter
    }
  ]
}

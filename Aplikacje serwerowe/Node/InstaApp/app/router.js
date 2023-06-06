const logger = require('tracer').colorConsole()
const controller = require('./controller')
const validationRoutes = setRoutes()
const noValidationRoutes = setNoValidationRoutes()
const matchingRoutes = setMatchingRoutes()

controller.deleteAllImages()

const router = (req, res) => {
  logger.log('żądany przez przeglądarkę adres:', req.url)
  logger.log('metoda:', req.method)

  const method = req.method.toLowerCase()

  controller.setHeaders(res, req.headers.origin)

  if (method === 'options') {
    return controller.sendOptions({ res })
  }

  const url = decodeURIComponent(req.url)
  const cookies = parseCookies(req.headers.cookie)
  logger.info(req.headers)
  const user = (cookies.has('token')) ? controller.verifyUser(cookies.get('token')) : false

  const handled = handleSimpleRoutes(res, req, method, url, user)
  if (handled === null) {
    if (user) {
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
    return controller.sendError({ res })
  }
}

module.exports = router

function handleSimpleRoutes (res, req, method, url, user) {
  const routes = (user) ? validationRoutes : noValidationRoutes

  if (!routes[method]) {
    logger.warn('Method not handled')
    return controller.sendError({ res })
  }

  const methodFunctions = routes[method]
  if (methodFunctions[url]) {
    const func = methodFunctions[url]
    return func({ res, req, user })
  }

  const checkMap = url.substring(0, url.lastIndexOf('/')) + '/?'
  logger.log(checkMap)
  if (methodFunctions[checkMap]) {
    const func = methodFunctions[checkMap]
    const query = url.substring(url.lastIndexOf('/') + 1)
    return func({ res, req, query, user })
  }

  return null
}

function parseCookies (cookieString) {
  const cookies = new Map()
  if (cookieString) {
    cookieString.split('; ').forEach(cookie => {
      const [key, value] = cookie.split('=')
      cookies.set(key, value)
    })
  }
  return cookies
}

function setRoutes () {
  const routes = {
    get: getRoutes(),
    post: postRoutes(),
    patch: patchRoutes(),
    delete: deleteRoutes()
  }
  return routes
}

function setNoValidationRoutes () {
  return {
    get: {
      '/api/user/confirm/?': controller.confirmUser
    },
    post: {
      '/api/user/register': controller.registerUser,
      '/api/user/login': controller.loginUser
    }
  }
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
    '/api/profile': controller.getUserData
  }
}

function postRoutes () {
  return {
    '/api/photos': controller.addImage,
    '/api/tags': controller.addTag
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

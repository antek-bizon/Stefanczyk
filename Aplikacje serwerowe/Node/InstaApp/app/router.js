const logger = require('tracer').colorConsole()
const controller = require('./controller')
const routes = setRoutes()
const matchingRoutes = setMatchingRoutes()

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
  const user = (cookies.has('token')) ? controller.verifyUser(cookies.get('token')) : false

  const methodFunctions = routes[method]
  if (!methodFunctions) {
    logger.warn('Method not handled')
    return controller.sendError({ res })
  }

  if (methodFunctions[url]) {
    if (methodFunctions[url].noValidation) {
      return methodFunctions[url].func({ res, req, user })
    }
    if (user) {
      const func = methodFunctions[url]
      return func({ res, req, user })
    }
    return controller.sendError({ res, status: 401 })
  }

  const checkMap = url.substring(0, url.lastIndexOf('/')) + '/?'
  if (methodFunctions[checkMap]) {
    const query = url.substring(url.lastIndexOf('/') + 1)

    if (methodFunctions[checkMap].noValidation) {
      return methodFunctions[checkMap].func({ res, req, query, user })
    }

    if (user) {
      const func = methodFunctions[checkMap]
      return func({ res, req, query, user })
    }

    return controller.sendError({ res, status: 401 })
  }

  for (const route of matchingRoutes) {
    if (route.matcher.test(url)) {
      if (user) {
        const queryArr = url.split('/').slice(-route.numOfParams)
        const func = route.func
        return func({ res, queryArr })
      } else {
        return controller.sendError({ res, status: 401 })
      }
    }
  }

  if (user) {
    logger.warn('No routes founded, trying to send file')
    return controller.sendFile({ res, url })
  } else {
    return controller.sendError({ res, status: 401 })
  }
}

module.exports = router

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

function getRoutes () {
  return {
    '/api/photos': controller.getAllImagesJSON,
    '/api/photos/?': controller.getOneImageJSON,
    '/api/tags/raw': controller.getAllTags,
    '/api/tags': controller.getAllTagsObjects,
    '/api/tags/?': controller.getOneTag,
    '/api/photos/tags/?': controller.getImageTags,
    '/api/filters/metadata/?': controller.getImageMetadata,
    '/api/filters': controller.getFilters,
    '/api/getfile/?': controller.getImage,
    '/api/profile': controller.getUserDataCookie,
    '/api/photos/album': controller.getImagesFromAlbumCookie,
    '/api/user/confirm/?': { func: controller.confirmUser, noValidation: true }
  }
}

function postRoutes () {
  return {
    '/api/photos': controller.addImage,
    '/api/tags': controller.addTag,
    '/api/author': controller.getAuthorData,
    '/api/photos/album': controller.getImagesFromAlbumJSON,
    '/api/user/register': { func: controller.registerUser, noValidation: true },
    '/api/user/login': { func: controller.loginUser, noValidation: true }
  }
}

function patchRoutes () {
  return {
    '/api/photos': controller.updateImage,
    '/api/photos/tags': controller.addOneTagToImage,
    '/api/photos/tags/multi': controller.addMultiTagsToImage,
    '/api/filters': controller.applyFilter,
    '/api/profile': controller.updateUserData,
    '/api/profile/picture': controller.setProfilePicture
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

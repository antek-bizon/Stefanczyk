const logger = require('tracer').colorConsole()
const controller = require('./controller')
const routes = setRoutes()

controller.deleteAllImages()

const router = (req, res) => {
  logger.log('żądany przez przeglądarkę adres:', req.url)
  logger.log('metoda:', req.method)

  const method = req.method.toLowerCase()
  const url = decodeURIComponent(req.url)

  if (!routes[method]) {
    logger.warn('Method not handled')
    controller.sendError({ res })
    return
  }

  const methodFunctions = routes[method]
  if (!methodFunctions[url]) {
    const checkMap = url.substring(0, url.lastIndexOf('/')) + '/?'
    logger.log(checkMap)
    if (!methodFunctions[checkMap]) {
      logger.warn('Url not handled')
      controller.sendError({ res })
    } else {
      const func = methodFunctions[checkMap]
      const query = url.substring(url.lastIndexOf('/') + 1)
      func({ res, req, query })
    }
  } else {
    const func = methodFunctions[url]
    func({ res, req })
  }
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
    '/api/photos/tags/?': controller.getImageTags
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
    '/api/photos/tags/multi': controller.addMultiTagsToImage
  }
}

function deleteRoutes () {
  return {
    '/api/photos/?': controller.deleteImage
  }
}

const logger = require('tracer').colorConsole()

const sendError = require('./commonController').sendError
const sendSuccess = require('./commonController').sendSuccess
const sendFile = require('./commonController').sendFile
const fileController = require('./fileController')
const reqBodyController = require('./requestBodyController')
const filtersController = require('./filtersController')

const imgData = []

module.exports = {
  getImageData: () => {
    return imgData
  },

  addImage: async ({ req, res, user }) => {
    try {
      const fileInfo = await fileController.saveFile(req, user.email)

      logger.log(fileInfo)

      imgData.push({
        id: (imgData.length === 0) ? 1 : imgData[imgData.length - 1].id + 1,
        album: user.email,
        originalName: fileInfo.originalName,
        url: fileInfo.url,
        lastChange: 'original',
        history: [
          {
            status: 'original',
            timestamp: Date.now().toString()
          }
        ],
        tags: []
      })
      logger.log(imgData)

      return sendSuccess({ res, status: 201, data: 'File saved successfully' })
    } catch (err) {
      logger.error(err)
      return sendError({ res, status: 400, msg: 'Parsing failed' })
    }
  },

  getAllImagesJSON: ({ res }) => {
    return sendSuccess({ res, data: imgData })
  },

  getOneImageJSON: ({ res, query }) => {
    const queryInt = parseInt(query)
    if (!queryInt) {
      return sendError({ res, status: 400, msg: 'Wrong query' })
    }

    for (const img of imgData) {
      if (queryInt === img.id) {
        return sendSuccess({ res, data: img })
      }
    }
    return sendError({ res, msg: 'Image not found' })
  },

  getImagesFromAlbumJSON: ({ res, user }) => {
    const images = imgData.filter(e => e.album === user.email)
    if (images.length === 0) {
      return sendError({ res, status: 404, msg: 'Album not found' })
    }

    return sendSuccess({ res, data: images })
  },

  deleteImage: ({ res, query }) => {
    const queryInt = parseInt(query)
    if (!queryInt) {
      return sendError({ res, status: 400, msg: 'Wrong query' })
    }

    for (let i = 0; i < imgData.length; i++) {
      if (queryInt === imgData[i].id) {
        sendSuccess({ res, data: 'Image deleted' })
        fileController.deleteOne(imgData[i].url)
        imgData.splice(i, 1)
        return
      }
    }
    return sendError({ res, msg: 'Image not found' })
  },

  updateImage: async ({ res, req }) => {
    const patchData = JSON.parse(await reqBodyController.getRequestData(req))
    logger.log(patchData)
    if (!patchData || !patchData.id) {
      logger.warn('Error during parsing data')
      return sendError({ res, status: 400, msg: 'Error during parsing data' })
    }

    for (const img of imgData) {
      if (patchData.id === img.id) {
        img.history.push({
          status: 'zmienione ' + img.history.length,
          timestamp: Date.now().toString()
        })
        return sendSuccess({ res, data: img })
      }
    }

    return sendError({ res, msg: 'Image not found' })
  },

  getImageMetadata: async ({ res, query }) => {
    const queryInt = parseInt(query)
    if (!queryInt) {
      return sendError({ res, status: 400, msg: 'Wrong query' })
    }

    const image = imgData.find(e => e.id === queryInt)
    if (!image) {
      return sendError({ res, msg: 'Image not found' })
    }
    const metadata = await filtersController.imageMetadata(image.url)
    return sendSuccess({ res, data: metadata })
  },

  getImage: async ({ res, query }) => {
    const queryInt = parseInt(query)
    if (!queryInt) {
      logger.warn('Wrong query')
      return sendError({ res, status: 400, msg: 'Wrong query' })
    }

    const image = imgData.find(e => e.id === queryInt)
    if (!image) {
      logger.warn('Image not found')
      return sendError({ res, msg: 'Image not found' })
    }
    logger.log(image.url)

    return sendFile({ res, url: image.url })
  },

  getImageWithFilter: async ({ res, queryArr }) => {
    if (!queryArr || queryArr.length !== 2) {
      logger.warn('Wrong query')
      return sendError({ res, status: 400, msg: 'Wrong query' })
    }

    const imageId = parseInt(queryArr[0])
    const filter = queryArr[1].toLowerCase()
    if (!imageId || !filter) {
      logger.warn('Wrong query')
      return sendError({ res, status: 400, msg: 'Wrong query' })
    }

    const image = imgData.find(e => e.id === imageId)
    if (!image) {
      logger.warn('Image not found')
      return sendError({ res, msg: 'Image not found' })
    }

    const imageWithFilter = image.history.find(e => e.status === filter)
    if (!imageWithFilter) {
      logger.warn('Filter not found')
      return sendError({ res, msg: 'Filter not found' })
    }

    return sendFile({ res, url: imageWithFilter.url })
  },

  applyFilter: async ({ res, req }) => {
    const filterData = JSON.parse(await reqBodyController.getRequestData(req))
    logger.log(filterData)
    if (!filterData || !filterData.imageId || !filterData.filter) {
      logger.warn('Error during parsing data')
      return sendError({ res, status: 400, msg: 'Error during parsing data' })
    }

    const image = imgData.find(e => e.id === filterData.imageId)
    if (!image) {
      return sendError({ res, msg: 'Image not found' })
    }

    const newImagePath = await filtersController.applyFilter(image.url, filterData.filter, filterData.data)
    if (newImagePath) {
      image.history.push({
        status: filterData.filter,
        timestamp: Date.now().toString(),
        url: newImagePath
      })
      logger.log(image)
      return sendSuccess({ res, status: 201, data: 'Filter applied' })
    } else {
      return sendError({ res, status: 400, msg: 'Filter not applied' })
    }
  }
}

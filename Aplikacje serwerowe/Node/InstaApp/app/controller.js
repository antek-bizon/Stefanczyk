const logger = require('tracer').colorConsole()
const fileController = require('./fileController')
const reqBodyController = require('./requestBodyController')
const imgData = []
const sendError = require('./commonController').sendError
const sendSuccess = require('./commonController').sendSuccess
const tagsController = require('./tagsController')

module.exports = {
  addImage: async ({ req, res }) => {
    const { fields, fileInfo } = await fileController.saveFile(req)
    logger.log(fields, fileInfo)
    imgData.push({
      id: (imgData.length === 0) ? 1 : imgData[imgData.length - 1].id + 1,
      album: fields.album,
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
    console.log(imgData)
    sendSuccess({ res, data: 'Filed saved successfully' })
  },

  sendError: ({ res }) => {
    res.writeHead(404)
    res.end()
  },

  getAllImagesJSON: ({ res }) => {
    sendSuccess({ res, type: 'Application/json', data: JSON.stringify(imgData) })
  },

  getOneImageJSON: ({ res, query }) => {
    const queryInt = parseInt(query)
    if (!queryInt) {
      return sendError({ res, msg: 'Wrong query' })
    }

    for (const img of imgData) {
      if (queryInt === img.id) {
        return sendSuccess({ res, type: 'Application/json', data: JSON.stringify(img) })
      }
    }
    sendError({ res, msg: 'Image not found' })
  },

  deleteImage: ({ res, query }) => {
    const queryInt = parseInt(query)
    if (!queryInt) {
      return sendError({ res, msg: 'Wrong query' })
    }

    for (let i = 0; i < imgData.length; i++) {
      if (queryInt === imgData[i].id) {
        sendSuccess({ res, data: 'Image deleted' })
        fileController.deleteOne(imgData[i].url)
        imgData.splice(i, 1)
        return
      }
    }
    sendError({ res, msg: 'Image not found' })
  },

  deleteAllImages: () => {
    fileController.deleteAll()
  },

  updateImage: async ({ res, req }) => {
    const patchData = JSON.parse(await reqBodyController.getRequestData(req))
    logger.log(patchData)
    if (!patchData || !patchData.id) {
      logger.warn('Error during parsing data')
      return sendError({ res, msg: 'Error during parsing data' })
    }

    for (const img of imgData) {
      if (patchData.id === img.id) {
        img.history.push({
          status: 'zmienione ' + img.history.length,
          timestamp: Date.now().toString()
        })
        return sendSuccess({ res, type: 'Application/json', data: JSON.stringify(img) })
      }
    }

    sendError({ res, msg: 'Image not found' })
  },

  getAllTags: tagsController.getAllTags,
  getAllTagsObjects: tagsController.getAllTagsObjects,
  getOneTag: tagsController.getOneTag,
  addTag: tagsController.addTag,

  addOneTagToImage: async ({ res, req }) => {
    const tagData = JSON.parse(await reqBodyController.getRequestData(req))
    if (!tagData || !tagData.imageId || !tagData.name || !tagData.popularity) {
      logger.warn('Error during parsing data')
      return sendError({ res, msg: 'Error during parsing data' })
    }

    const image = imgData.find(e => e.id === tagData.imageId)
    if (!image) {
      return sendError({ res, msg: 'Image not found' })
    }

    const popularity = parseInt(tagData.popularity)
    if (isNaN(popularity)) {
      return sendError({ res, msg: 'Wrong popularity' })
    }

    if (image.tags.find(e => e.name === tagData.name)) {
      return sendError({ res, msg: 'Tag already exists' })
    }

    image.tags.push({
      name: tagData.name,
      popularity
    })
    sendSuccess({ res, data: 'Tag added' })
  },

  addMultiTagsToImage: async ({ res, req }) => {
    const tagsData = JSON.parse(await reqBodyController.getRequestData(req))
    if (!tagsData || !tagsData.imageId || !tagsData.tags) {
      logger.warn('Error during parsing data')
      return sendError({ res, msg: 'Error during parsing data' })
    } else if (!Array.isArray(tagsData.tags)) {
      tagsData.tags = [tagsData.tags]
    }

    const image = imgData.find(e => e.id === tagsData.imageId)
    if (!image) {
      return sendError({ res, msg: 'Image not found' })
    }

    const failed = []
    for (const tag of tagsData.tags) {
      if (!tag.name || !tag.popularity) {
        failed.push(tag)
        continue
      }
      const popularity = parseInt(tag.popularity)
      if (isNaN(popularity)) {
        failed.push(tag)
        continue
      }

      if (image.tags.find(e => e.name === tag.name)) {
        failed.push(tag)
        continue
      }

      image.tags.push({
        name: tag.name,
        popularity
      })
    }
    sendSuccess({
      res,
      data: 'Tag added, failed ' + failed.length + ': ' + JSON.stringify(failed)
    })
  },

  getImageTags: ({ res, query }) => {
    const queryInt = parseInt(query)
    if (!queryInt) {
      return sendError({ res, msg: 'Wrong query' })
    }

    for (const img of imgData) {
      if (queryInt === img.id) {
        return sendSuccess({
          res,
          type: 'Application/json',
          data: JSON.stringify({ id: img.id, tags: img.tags })
        })
      }
    }
    sendError({ res, msg: 'Image not found' })
  }
}
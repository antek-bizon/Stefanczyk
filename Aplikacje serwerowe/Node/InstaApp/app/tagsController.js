const logger = require('tracer').colorConsole()

const sendError = require('./commonController').sendError
const sendSuccess = require('./commonController').sendSuccess
const reqBodyController = require('./requestBodyController')
const imgData = require('./imageController').getImageData()

const tags = [
  '#love',
  '#instagood',
  '#fashion',
  '#photooftheday',
  '#art',
  '#photography',
  '#instagram',
  '#beautiful',
  '#picoftheday',
  '#nature',
  '#happy',
  '#cute',
  '#travel',
  '#style',
  '#followme',
  '#tbt',
  '#instadaily',
  '#repost',
  '#like4like',
  '#summer',
  '#beauty',
  '#fitness',
  '#food',
  '#selfie',
  '#me',
  '#instalike',
  '#girl',
  '#friends',
  '#fun',
  '#photo'
].map((e, id) => { return { id, name: e, popularity: Math.floor(Math.random() * 1000) } })

module.exports = {
  getAllTags: ({ res }) => {
    sendSuccess({
      res,
      type: 'Application/json',
      data: tags.map(e => e.name)
    })
  },

  getAllTagsObjects: ({ res }) => {
    sendSuccess({
      res,
      data: tags
    })
  },

  getOneTag: ({ res, query }) => {
    const queryInt = parseInt(query)
    if (!queryInt) {
      return sendError({ res, msg: 'Wrong query' })
    }

    sendSuccess({ res, data: tags[queryInt] })
  },

  addTag: async ({ res, req }) => {
    const tagData = JSON.parse(await reqBodyController.getRequestData(req))
    logger.log(tagData)
    if (!tagData || !tagData.name || !tagData.popularity) {
      logger.warn('Error during parsing data')
      return sendError({ res, status: 400, msg: 'Error during parsing data' })
    }

    const popularity = parseInt(tagData.popularity)
    if (isNaN(popularity)) {
      return sendError({ res, status: 400, msg: 'Wrong popularity' })
    }

    if (tags.find(e => e.name === tagData.name)) {
      return sendError({ res, status: 409, msg: 'Tag already exists' })
    }

    tags.push({
      id: tags.length,
      name: tagData.name,
      popularity
    })
    sendSuccess({ res, status: 201, data: 'Tag added' })
  },

  addOneTagToImage: async ({ res, req }) => {
    const tagData = JSON.parse(await reqBodyController.getRequestData(req))
    if (!tagData || !tagData.imageId || !tagData.name || !tagData.popularity) {
      logger.warn('Error during parsing data')
      return sendError({ res, status: 400, msg: 'Error during parsing data' })
    }

    const image = imgData.find(e => e.id === tagData.imageId)
    if (!image) {
      return sendError({ res, msg: 'Image not found' })
    }

    const popularity = parseInt(tagData.popularity)
    if (isNaN(popularity)) {
      return sendError({ res, status: 400, msg: 'Wrong popularity' })
    }

    if (image.tags.find(e => e.name === tagData.name)) {
      return sendError({ res, status: 409, msg: 'Tag already exists' })
    }

    image.tags.push({
      name: tagData.name,
      popularity
    })
    sendSuccess({ res, status: 201, data: 'Tag added' })
  },

  addMultiTagsToImage: async ({ res, req }) => {
    const tagsData = JSON.parse(await reqBodyController.getRequestData(req))
    if (!tagsData || !tagsData.imageId || !tagsData.tags) {
      logger.warn('Error during parsing data')
      return sendError({ res, status: 400, msg: 'Error during parsing data' })
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

      if (!tags.find(e => e.name === tag.name)) {
        tags.push({
          id: tags.length,
          name: tag.name,
          popularity
        })
      }

      image.tags.push({
        name: tag.name,
        popularity
      })
    }
    sendSuccess({
      res,
      status: 201,
      data: 'Tag added, failed ' + failed.length + ': ' + JSON.stringify(failed)
    })
  },

  getImageTags: ({ res, query }) => {
    const queryInt = parseInt(query)
    if (!queryInt) {
      return sendError({ res, status: 400, msg: 'Wrong query' })
    }

    for (const img of imgData) {
      if (queryInt === img.id) {
        return sendSuccess({
          res,
          data: { id: img.id, tags: img.tags }
        })
      }
    }
    sendError({ res, msg: 'Image not found' })
  }
}

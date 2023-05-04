const sendError = require('./commonController').sendError
const sendSuccess = require('./commonController').sendSuccess
const reqBodyController = require('./requestBodyController')
const logger = require('tracer').colorConsole()

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
      data: JSON.stringify(tags.map(e => e.name))
    })
  },

  getAllTagsObjects: ({ res }) => {
    sendSuccess({
      res,
      type: 'Application/json',
      data: JSON.stringify(tags)
    })
  },

  getOneTag: ({ res, query }) => {
    const queryInt = parseInt(query)
    if (!queryInt) {
      return sendError({ res, msg: 'Wrong query' })
    }

    sendSuccess({ res, type: 'Application/json', data: JSON.stringify(tags[queryInt]) })
  },

  addTag: async ({ res, req }) => {
    const tagData = JSON.parse(await reqBodyController.getRequestData(req))
    logger.log(tagData)
    if (!tagData || !tagData.name || !tagData.popularity) {
      logger.warn('Error during parsing data')
      return sendError({ res, msg: 'Error during parsing data' })
    }

    const popularity = parseInt(tagData.popularity)
    if (isNaN(popularity)) {
      return sendError({ res, msg: 'Wrong popularity' })
    }

    if (tags.find(e => e.name === tagData.name)) {
      return sendError({ res, msg: 'Tag already exists' })
    }

    tags.push({
      id: tags.length,
      name: tagData.name,
      popularity
    })
    sendSuccess({ res, data: 'Tag added' })
  }
}

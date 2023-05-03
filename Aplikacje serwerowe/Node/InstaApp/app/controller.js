const logger = require('tracer').colorConsole()
const fileController = require('./fileController')
const reqBodyController = require('./requestBodyController')
const imgData = []
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
]

function sendError({ res, msg }) {
  res.writeHead(404, { 'Content-type': 'plain/text' })
  res.write(msg)
  res.end()
}

function sendSuccess({ res, type = 'plain/text', data = '' }) {
  res.writeHead(200, { 'Content-type': type })
  res.write(data)
  res.end()
}

module.exports = {
  addImage: async ({ req, res }) => {
    const { fields, files } = await fileController.saveFile(req)
    logger.log(fields, files)
    imgData.push({
      id: (imgData.length === 0) ? 1 : imgData[imgData.length - 1].id + 1,
      album: fields.album,
      originalName: files.file.name,
      url: files.file.path.substring(files.file.path.lastIndexOf('uploads')),
      lastChange: 'original',
      history: [
        {
          status: 'original',
          timestamp: Date.now().toString()
        }
      ]
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
    for (const img of imgData) {
      if (query == img.id) {
        return sendSuccess({ res, type: 'Application/json', data: JSON.stringify(img) })
      }
    }
    sendError({ res, msg: 'Image not found' })
  },

  deleteImage: ({ res, query }) => {
    for (let i = 0; i < imgData.length; i++) {
      if (query == imgData[i].id) {
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
  }
}
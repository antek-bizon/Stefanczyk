const formidable = require('formidable')
const logger = require('tracer').colorConsole()
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs/promises')

const uploadDir = path.join(__dirname, '../uploads')

module.exports = {
  saveFile: (req) => {
    const form = formidable({
      uploadDir,
      keepExtensions: true
    })

    return new Promise((resolve, reject) => {
      try {
        form.parse(req, function (err, fields, files) {
          if (err) {
            throw err
          }
          const imageInfo = {
            fields: fields,
            files: files
          }
          resolve(imageInfo)
        })
      } catch (ex) {
        reject(ex)
      }
    })

  },

  readAll: async () => {
    const files = await fsPromises.readdir(path.join(__dirname, '../uploads'))
    logger.log(files)
    return files
  },

  deleteAll: async () => {
    fs.readdir(uploadDir, async (err, files) => {
      if (err) throw err

      await Promise.all(files.map(e => {
        return fsPromises.unlink(path.join(uploadDir, e))
      }))
    })
  },

  deleteOne: async (url) => {
    const filepath = path.join(__dirname, '../', url)
    if (fs.existsSync(filepath)) {
      return fsPromises.unlink(filepath)
    }
    logger.warn('File do not exist:', url)
  }
}

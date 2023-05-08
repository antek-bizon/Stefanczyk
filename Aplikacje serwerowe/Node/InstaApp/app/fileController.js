const formidable = require('formidable')
const logger = require('tracer').colorConsole()
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs/promises')
const mimeTypes = require('mime-types')

const uploadDir = path.join(__dirname, '../uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdir(uploadDir, (err) => {
    if (err) throw err
  })
}

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

          const uploadName = files.file.path.replaceAll('\\', '/').split('/').pop()

          const newPath = path.join(uploadDir, fields.album)
          const fileInfo = {
            originalName: files.file.name,
            url: 'uploads/' + fields.album + '/' + uploadName
          }

          if (fs.existsSync(newPath)) {
            fs.rename(files.file.path, fileInfo.url, () => {
              if (err) throw err
            })
          } else {
            fs.mkdir(newPath, (err) => {
              if (err) throw err

              fs.rename(files.file.path, fileInfo.url, () => {
                if (err) throw err
              })
            })
          }

          resolve({
            fields,
            fileInfo
          })
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

  deleteAll: () => {
    fs.readdir(uploadDir, (err, files) => {
      if (err) throw err

      Promise.all(files.map(e => {
        return fsPromises.rm(path.join(uploadDir, e), { recursive: true, force: true })
      }))
    })
  },

  deleteOne: (url) => {
    const filepath = path.join(__dirname, '../', url)
    if (fs.existsSync(filepath)) {
      fsPromises.rm(filepath, { force: true })
    } else {
      logger.warn('File do not exist:', url)
    }
  },

  getFile: async (url) => {
    const filepath = path.join(__dirname, '../', url)
    if (fs.existsSync(filepath)) {
      const data = await fsPromises.readFile(filepath)
      const type = mimeTypes.lookup(filepath)
      return { data, type }
    }

    logger.warn('File do not exist:', filepath)
    return null
  }
}

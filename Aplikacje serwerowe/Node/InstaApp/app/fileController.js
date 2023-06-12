const formidable = require('formidable')
const logger = require('tracer').colorConsole()
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs/promises')
const mimeTypes = require('mime-types')

const uploadPath = path.join(__dirname, '../uploads')
const profilePath = path.join(__dirname, '../profiles')

if (!fs.existsSync(uploadPath)) {
  fs.mkdir(uploadPath, (err) => {
    if (err) throw err
  })
}

if (!fs.existsSync(profilePath)) {
  fs.mkdir(profilePath, (err) => {
    if (err) throw err
  })
}

const deleteAll = (profile = false) => {
  const dir = profile ? profilePath : uploadPath
  fs.readdir(dir, (err, files) => {
    if (err) throw err

    Promise.all(files.map(e => {
      return fsPromises.rm(path.join(dir, e), { recursive: true, force: true })
    }))
  })
}

deleteAll()
deleteAll(true)

module.exports = {
  saveFile: (req, album, profil = false) => {
    const uploadDir = profil ? profilePath : uploadPath
    const form = formidable({
      uploadDir,
      keepExtensions: true
    })

    return new Promise((resolve, reject) => {
      try {
        form.parse(req, function (err, _, files) {
          if (err || !files.file) {
            return reject(err)
          }

          const uploadName = files.file.path.replaceAll('\\', '/').split('/').pop()

          const newPath = path.join(uploadDir, album)
          const fileInfo = {
            originalName: files.file.name,
            url: profil ? 'profiles/' + album + '/' + uploadName : 'uploads/' + album + '/' + uploadName
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

          resolve(fileInfo)
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

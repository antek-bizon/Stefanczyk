const express = require('express')
const app = express()
const PORT = 3000
const path = require('path')
const hbs = require('express-handlebars')
const formidable = require('formidable')
const fs = require('fs')
const fsPromises = require('fs/promises')
const sizeOf = require('buffer-image-size')

let dir = {}

app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', hbs({
  extname: '.hbs',
  partialsDir: 'views/partials',
  helpers: {
    whatDir: function (name) {
      if (name === '') {
        return 'home'
      }

      return name
    },
    linkToDir: function (name) {
      const link = []
      for (let i = 1; i < dir.dirName.length; i++) {
        link.push(dir.dirName[i])
        if (dir.dirName[i] === name) {
          return '?dirName=' + link.join('/')
        }
      }
      return ''
    },
    currentDir: function () {
      return dir.dirName.join('/')
    },
    editorType: function (filename) {
      const ext = getExtension(filename)
      switch (ext) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'bmp':
        case 'gif':
          return 'imageeditor'
        default:
          return 'texteditor'
      }
    }
  }
}))

app.set('view engine', 'hbs')

function getExtension (filename) {
  for (let i = filename.length - 1; i >= 0; i--) {
    if (filename[i] === '.') {
      return filename.slice(i + 1)
    }
  }
  return ''
}

function getFileIcon (filename) {
  const ext = getExtension(filename)

  switch (ext) {
    case 'doc':
    case 'docx':
      return './gfx/doc.png'
    case 'jpg':
    case 'jpeg':
      return './gfx/jpg.png'
    case 'pdf':
      return './gfx/pdf.png'
    case 'png':
      return './gfx/png.png'
    case 'txt':
      return './gfx/text.png'
    case 'zip':
      return './gfx/zip.png'
  }

  return './gfx/other.png'
}

async function getDirectory (dirName) {
  const dir = {
    folders: [],
    files: [],
    others: [],
    dirName: ['']
  }

  let currentDirectory = null
  if (dirName) {
    const splited = dirName.split('/')
    splited.forEach((e) => {
      if (e !== '') {
        dir.dirName.push(e)
      }
    })
    currentDirectory = path.join(__dirname, 'pliki', dirName)
  } else {
    currentDirectory = path.join(__dirname, 'pliki')
  }
  // console.log('Current directory', currentDirectory)
  const directory = fs.readdirSync(currentDirectory)
  // console.log(directory)

  await Promise.all(directory.map(async (e) => {
    const stats = await fsPromises.lstat(path.join(currentDirectory, e))
    const d = { name: e }

    if (stats.isDirectory()) {
      d.img = './gfx/folder.png'
      dir.folders.push(d)
    } else if (stats.isFile()) {
      d.img = getFileIcon(d.name)
      dir.files.push(d)
    } else {
      d.img = '/gfx/other.png'
      dir.others.push(d)
    }
  })
  )

  return dir
}

// function getDirectory() {
//     const dir = {
//         folders: [],
//         files: [],
//         others: [],
//     }

//     const directory = fs.readdirSync(path.join(__dirname, 'pliki'))
//     directory.forEach((e) => {
//         const stats = fs.lstatSync(path.join(__dirname, 'pliki', e))
//         if (stats.isDirectory()) {
//             dir.folders.push(e)
//         } else if (stats.isFile()) {
//             dir.files.push(e)
//         } else {
//             dir.others.push(e)
//         }
//     })

//     return dir
// }

app.get('/', async function (req, res) {
  const dirName = req.query.dirName
  dir = await getDirectory(dirName)
  // console.log(dir)

  res.render('index.hbs', dir)
})

app.get('/newFolder', function (req, res) {
  const name = req.query.name
  const currentDir = req.query.currentDir

  if (name) {
    let newFolder = null
    if (currentDir) {
      newFolder = path.join(__dirname, 'pliki', currentDir, name)
    } else {
      newFolder = path.join(__dirname, 'pliki', name)
    }
    if (!fs.existsSync(newFolder)) {
      fs.mkdirSync(newFolder)
      console.log('dodane')
    } else {
      console.log('juz istnieje')
    }
  }
  res.redirect(`/?dirName=${currentDir}`)
})

app.get('/newFile', function (req, res) {
  if (!req.query.name) {
    res.redirect('/')
    return
  }
  const currentDir = req.query.currentDir
  const name = req.query.name
  const type = getExtension(req.query.name)

  const tmp = path.join(__dirname, 'templateFiles', 'tmp.' + type)
  let knownType = false
  if (fs.existsSync(tmp)) {
    knownType = true
  }

  if (name) {
    let newFile = null
    if (currentDir) {
      newFile = path.join(__dirname, 'pliki', currentDir, name)
    } else {
      newFile = path.join(__dirname, 'pliki', name)
    }
    if (!fs.existsSync(newFile)) {
      if (knownType) {
        fs.copyFileSync(tmp, newFile)
      } else {
        fs.writeFileSync(newFile, '')
      }
      console.log('dodane')
    } else {
      console.log('juz istnieje')
    }
  }
  res.redirect(`/?dirName=${currentDir}`)
})

app.post('/upload', function (req, res) {
  console.log('Uploading')
  const form = formidable({})
  form.keepExtensions = true
  form.multiples = true
  form.on('field', function (field, value) {
    console.log(field, value)
    form.uploadDir = path.join(__dirname, 'pliki' + value)
    form.on('fileBegin', function (name, file) {
      file.path = form.uploadDir + '/' + file.name
    })
  })

  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log(err)
    }
    if (fields.currentDir) {
      res.redirect(`/?dirName=${fields.currentDir}`)
    } else {
      res.redirect('/')
    }
  })
})

app.get('/delete', function (req, res) {
  if (!req.query.name) {
    res.redirect('/')
    return
  }
  const currentDir = req.query.dirName
  let name = null
  if (currentDir) {
    name = path.join(__dirname, 'pliki', currentDir, req.query.name)
  } else {
    name = path.join(__dirname, 'pliki', req.query.name)
  }

  if (fs.existsSync(name)) {
    const stats = fs.lstatSync(name)
    if (stats.isDirectory()) {
      fs.rmSync(name, { recursive: true, force: true })
    } else {
      fs.unlinkSync(name)
    }
  } else {
    console.log('Plik do usuniecia nie istnieje:', name)
  }

  res.redirect(`/?dirName=${currentDir}`)
})

app.get('/renameFolder', function (req, res) {
  console.log(req.query)
  if (req.query.name && req.query.currentDir) {
    const oldName = path.join(__dirname, 'pliki' + req.query.currentDir)
    const newDir = req.query.currentDir.substring(0, req.query.currentDir.lastIndexOf('/') + 1) + req.query.name
    const newName = path.join(__dirname, 'pliki', newDir)
    console.log(newName)
    if (!fs.existsSync(newName)) {
      fs.renameSync(oldName, newName)
      res.redirect(`/?dirName=${newDir}`)
      return
    } else {
      console.log('Nazwa jest zajeta')
    }
  }
  res.redirect(`/?dirName=${req.query.currentDir}`)
})

app.get('/renameFile', function (req, res) {
  console.log(req.query)
  if (req.query.name && req.query.currentDir) {
    const oldName = path.join(__dirname, 'pliki' + req.query.currentDir)
    const currentDir = req.query.currentDir.substring(0, req.query.currentDir.lastIndexOf('/'))
    const newName = path.join(__dirname, 'pliki', currentDir, req.query.name)
    console.log(newName)
    if (!fs.existsSync(newName)) {
      fs.renameSync(oldName, newName)
      res.redirect(`/texteditor?dirName=${currentDir}&name=${req.query.name}`)
      return
    } else {
      console.log('Nazwa jest zajeta')
    }
  }

  res.redirect(`/?dirName=${req.query.currentDir}`)
})

app.get('/texteditor', function (req, res) {
  if (!req.query.name) {
    res.redirect('/')
    return
  }

  const context = {
    name: req.query.name,
    dirName: '',
    buffer: ''
  }

  let pathToFile = null

  if (req.query.dirName && req.query.dirName !== '') {
    context.dirName = req.query.dirName
    pathToFile = path.join(__dirname, 'pliki', context.dirName, context.name)
  } else {
    pathToFile = path.join(__dirname, 'pliki', context.name)
  }

  context.buffer = fs.readFileSync(pathToFile, { encoding: 'utf-8' })

  res.render('texteditor.hbs', context)
})

app.post('/saveFile', express.json(), function (req, res) {
  if (req.body.filename) {
    const filePath = path.join(__dirname, 'pliki', req.body.filename)
    console.log(filePath)
    // console.log(req.body.data)
    fs.writeFile(filePath, req.body.data, function (err) {
      if (err) {
        console.error(err)
        res.send(JSON.stringify({ err: true }))
      } else {
        console.log('Success')
        res.send(JSON.stringify({ err: false }))
      }
    })
  } else {
    res.send(JSON.stringify({ err: true }))
  }
})

app.post('/saveConfig', express.json(), function (req, res) {
  console.log(req.body)
  if (req.body.fontSize) {
    const filePath = path.join(__dirname, 'static', 'css', 'config.css')
    console.log(filePath)
    const fileData = `:root {
      --font-size: ${req.body.fontSize};
      --bg-color: ${req.body.bgColor};
      --color: ${req.body.color};
}`
    fs.writeFile(filePath, fileData, function (err) {
      if (err) {
        console.error(err)
        res.send(JSON.stringify({ err: true }))
      } else {
        console.log('Success')
        res.send(JSON.stringify({ err: false }))
      }
    })
  } else {
    res.send(JSON.stringify({ err: true }))
  }
})

app.get('/showfile', function (req, res) {
  console.log(req.query.filename)
  const filePath = path.join(__dirname, 'pliki', req.query.filename)
  console.log(filePath)

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath)
  } else {
    res.redirect('/')
  }
})

app.get('/imageeditor', function (req, res) {
  if (!req.query.name) {
    res.redirect('/')
    return
  }

  const context = {
    name: req.query.name,
    image_path: '',
    dirName: '',
    buffer: '',
    filter: [
      'grayscale',
      'invert',
      'sepia'
    ]
  }

  if (req.query.dirName && req.query.dirName !== '') {
    context.dirName = req.query.dirName
    context.image_path = `.${req.query.dirName}/${req.query.name}`

    const imagePath = path.join(__dirname, 'pliki', req.query.dirName, req.query.name)
    const image = fs.readFileSync(imagePath)
    context.dimensions = sizeOf(image)
  } else {
    context.image_path = `./${req.query.name}`
    const imagePath = path.join(__dirname, 'pliki', req.query.dirName, req.query.name)
    const image = fs.readFileSync(imagePath)
    context.dimensions = sizeOf(image)
  }

  res.render('imageeditor.hbs', context)
})

app.post('/saveImage', function (req, res) {
  console.log('Uploading')
  const form = formidable({})

  form.keepExtensions = true
  form.multiples = true

  let filename = ''
  let dirName = ''

  form.on('field', function (field, value) {
    // console.log(field, value)
    if (field === 'src') {
      form.uploadDir = path.join(__dirname, 'pliki' + value)
      form.on('fileBegin', function (name, file) {
        file.path = form.uploadDir
      })
    } else if (field === 'dir') {
      dirName = value
    } else if (field === 'name') {
      filename = value
    }
  })

  form.parse(req, function (err, fields, files) {
    // console.log(fields, files)
    console.log(dirName, filename)
    if (err) {
      console.error(err)
      res.send(JSON.stringify({ err: true }))
    } else {
      console.log('Success')
      res.send(JSON.stringify({ err: false }))
    }
  })
})

app.use(express.static('static'))
app.use(express.static('pliki'))

// Nasłuchiwanie
app.listen(PORT, function () {
  console.log('Start serwera na porcie: ' + PORT)
})

const express = require('express')
const app = express()
const PORT = 3000
const path = require('path')
const hbs = require('express-handlebars')
const formidable = require('formidable')

const filesArr = []

app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', hbs({
  extname: '.hbs',
  partialsDir: 'views/partials'
  // helpers: {}
}))

app.set('view engine', 'hbs')

app.get('/', function (req, res) {
  res.render('index.hbs')
})

app.get('/filemanager', function (req, res) {
  const context = {
    filesArr
  }
  res.render('filemanager.hbs', context)
})

function addFile (e) {
  let id = 1
  if (filesArr.length !== 0) {
    id = filesArr[filesArr.length - 1].id + 1
  }

  let img = ''
  switch (e.type) {
    case 'application/zip':
      img = 'zip.png'
      break
    case 'application/pdf':
      img = 'pdf.png'
    case 'text/plain':
    case 'text/csv':
    case 'text/html':
      img = 'text.png'
      break
    case 'image/jpeg':
      img = 'jpg.png'
      break
    case 'image/png':
      img = 'png.png'
      break
    default:
      img = 'other.png'
  }

  filesArr.push({ id, name: e.name, size: e.size, type: e.type, path: e.path, savedate: e.lastModifiedDate, img })
}

app.post('/add', function (req, res) {
  const form = formidable({})
  form.keepExtensions = true
  form.multiples = true
  form.uploadDir = path.join(__dirname + 'static', 'upload')

  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log(err)
      res.redirect('/')
      return
    }
    if (Array.isArray(files.files)) {
      files.files.forEach(e => {
        addFile(e)
      })
    } else {
      addFile(files.files)
    }
    console.log(filesArr)
    res.redirect('/filemanager')
  })
})

app.get('/deleteAll', function (req, res) {
  filesArr.length = 0
  res.redirect('/filemanager')
})

app.get('/delete/:id', function (req, res) {
  for (let i = 0; i < filesArr.length; i++) {
    if (filesArr[i].id === parseInt(req.params.id)) {
      filesArr.splice(i, 1)
      break
    }
  }
  res.redirect('/filemanager')
})

app.get('/show/:id', function (req, res) {
  for (let i = 0; i < filesArr.length; i++) {
    if (filesArr[i].id === parseInt(req.params.id)) {
      res.sendFile(filesArr[i].path)
      break
    }
  }
})

app.get('/info', function (req, res) {
  if (!req.query.id) {
    res.render('info.hbs', filesArr[0])
    return
  }
  for (let i = 0; i < filesArr.length; i++) {
    if (filesArr[i].id === parseInt(req.query.id)) {
      res.render('info.hbs', filesArr[i])
      break
    }
  }
})

app.get('/download', function (req, res) {
  if (!req.query.id) {
    console.log('Error, cannot download: no id')
    res.redirect('/filemanager')
    return
  }
  for (let i = 0; i < filesArr.length; i++) {
    if (filesArr[i].id === parseInt(req.query.id)) {
      res.download(filesArr[i].path)
      break
    }
  }
})

app.use(express.static('static'))

// Nasłuchiwanie
app.listen(PORT, function () {
  console.log('Start serwera na porcie: ' + PORT)
})

const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')
const express = require('express')
const app = express()
const port = 3000
const formidable = require('formidable')
const cors = require('cors')

if (!fs.existsSync('./upload')) {
  fs.mkdirSync('./upload')
}

app.use(cors())
app.use(express.static('./upload'))

app.post('/upload', (req, res) => {
  const form = formidable({
    multiples: true,
    uploadDir: './upload',
    keepExtensions: true
  })

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).send('Failed to upload image')
    } else {
      res.send('Image uploaded successfully')
    }
  })
})

app.get('/files', (req, res) => {
  fs.readdir('./upload', (err, files) => {
    if (err) res.status(400).send('failed to read dir')

    // res.header('Content-Type', 'application/json')
    res.send(JSON.stringify(files, null, 5))
  })
})

app.delete('/files', express.json(), (req, res) => {
  const arr = req.body.map(image => fsPromises.unlink(path.join('./upload', image)))
  Promise.allSettled(arr)
    .then(res.send('Deleted successfully'))
    .catch(e => console.error(e))
})

app.post('/rename', express.json(), (req, res) => {
  console.log(req.body.oldName, req.body.newName)

  if (!req.body.oldName || !req.body.newName) {
    return res.status(400).send('Invalid data')
  }

  const oldName = path.join('./upload', req.body.oldName)

  if (!fs.existsSync(oldName)) {
    return res.status(400).send('File to rename was not found')
  }

  const extension = req.body.oldName.slice(req.body.oldName.lastIndexOf('.'))
  const newName = path.join('./upload', req.body.newName + extension)

  fs.rename(oldName, newName, (err) => {
    if (err) throw err

    res.send('Image renamed successfully')
  })
})

app.listen(port, () => {
  console.log('Starting server on port:', port)
})

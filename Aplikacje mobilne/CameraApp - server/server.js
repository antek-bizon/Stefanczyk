const express = require('express')
const app = express()
const port = 3000

const formidable = require('express-formidable')

app.post('/upload', formidable({
  uploadDir: 'files',
  multiples: true
}), (req, res) => {
  console.log(req.fields)
  console.log(req.files)
})

app.listen(port, () => {
  console.log('Starting server on port:', port)
})

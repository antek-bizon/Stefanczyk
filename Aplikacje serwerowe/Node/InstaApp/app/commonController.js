const fileController = require('./fileController')

const sendError = ({ res, status = 404, msg = '' }) => {
  res.writeHead(status, { 'Content-type': 'application/json' })
  res.write(JSON.stringify({ msg, err: true }))
  res.end()
}

const sendSuccess = ({ res, status = 200, data = '', otherHeaders = [] }) => {
  for (const otherHeader of otherHeaders) {
    res.setHeader(otherHeader.key, otherHeader.value)
  }
  res.writeHead(status, { 'Content-type': 'application/json' })
  res.write(JSON.stringify({ data, err: false }))
  res.end()
}

const send = ({ res, status = 200, type = 'plain/text', data = '', otherHeaders = [] }) => {
  for (const otherHeader of otherHeaders) {
    res.setHeader(otherHeader.key, otherHeader.value)
  }
  res.writeHead(status, { 'Content-type': type })
  res.write(data)
  res.end()
}

const sendFile = async ({ res, url }) => {
  const file = await fileController.getFile(url)
  if (!file) {
    return sendError({ res, msg: 'File not found' })
  }

  send({ res, type: file.type, data: file.data })
}

module.exports = {
  sendSuccess,
  sendError,
  send,
  sendFile
}

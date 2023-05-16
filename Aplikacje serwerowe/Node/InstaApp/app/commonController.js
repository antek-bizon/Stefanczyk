module.exports = {
  sendError: ({ res, status = 404, msg = '' }) => {
    res.writeHead(status, { 'Content-type': 'plain/text' })
    res.write(msg)
    res.end()
  },

  sendSuccess: ({ res, status = 200, type = 'plain/text', data = '', otherHeaders = [] }) => {
    for (const otherHeader of otherHeaders) {
      res.setHeader(otherHeader.key, otherHeader.value) // TODO: add other headers
    }
    res.writeHead(status, { 'Content-type': type })
    res.write(data)
    res.end()
  }
}

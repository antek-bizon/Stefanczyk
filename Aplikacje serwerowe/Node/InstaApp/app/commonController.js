module.exports = {
  sendError: ({ res, msg }) => {
    res.writeHead(404, { 'Content-type': 'plain/text' })
    res.write(msg)
    res.end()
  },

  sendSuccess: ({ res, type = 'plain/text', data = '' }) => {
    res.writeHead(200, { 'Content-type': type })
    res.write(data)
    res.end()
  }
}

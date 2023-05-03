
module.exports = {
  getRequestData: (req) => {
    return new Promise((resolve, reject) => {
      try {
        let body = ''
        req.on('data', function (data) {
          body += data.toString()
        })

        req.on('end', function () {
          resolve(body)
        })
      } catch (ex) {
        reject(ex)
      }
    })
  }
}

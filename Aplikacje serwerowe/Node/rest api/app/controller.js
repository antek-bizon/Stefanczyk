const array = [1, 2, 3]

function createError(msg) {
  return { status: 404, type: 'plain/text', data: msg }
}

function createSuccess(type, data) {
  return { status: 200, type, data }
}

module.exports = {
  createError: (msg) => {
    return createError(msg)
  },
  createSuccess: (type, data) => {
    return createSuccess(type, data)
  },
  add: (req, res) => {
    let body = "";

    req.on("data", function (data) {
      console.log(data)
      body += data.toString();
    })

    req.on("end", function (data) {
      console.log(body)
      res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
      res.end(body);
    })
  },
  getOne: (index) => {
    if (index < 0 || array.length <= index) {
      return createError('Incorrect index')
    }

    return createSuccess('Application/json', JSON.stringify(array[index]))
  },
  getAll: () => {
    console.log('get all')

    return createSuccess('Application/json', JSON.stringify(array))
  },
  delete: () => {
    console.log('delete')

  },
  update: () => {
    console.log('update')

  },
}
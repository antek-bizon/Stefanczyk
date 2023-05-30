const imageController = require('./imageController')
const tagsController = require('./tagsController')
const userController = require('./userController')
const commonController = require('./commonController')

module.exports = {
  ...imageController,
  ...tagsController,
  ...userController,
  ...commonController
}

const imageController = require('./imageController')
const tagsController = require('./tagsController')
const userController = require('./userController')
const commonController = require('./commonController')
const filtersController = require('./filtersController')

module.exports = {
  ...imageController,
  ...tagsController,
  ...userController,
  ...commonController,
  getFilters: filtersController.getFilters
}

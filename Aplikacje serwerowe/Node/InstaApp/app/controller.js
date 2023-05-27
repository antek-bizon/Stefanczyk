const imageController = require('./imageController')
const tagsController = require('./tagsController')
const userController = require('./userController')
const commonController = require('./commonController')

module.exports = {
  ...imageController,
  ...tagsController,
  ...userController,
  ...commonController
  // addImage: imageController.addImage,
  // getAllImagesJSON: imageController.getAllImagesJSON,
  // getOneImageJSON: imageController.getOneImageJSON,
  // deleteImage: imageController.deleteImage,
  // deleteAllImages: imageController.deleteAllImages,
  // updateImage: imageController.updateImage,

  // getAllTags: tagsController.getAllTags,
  // getAllTagsObjects: tagsController.getAllTagsObjects,
  // getOneTag: tagsController.getOneTag,
  // addTag: tagsController.addTag,
  // addOneTagToImage: tagsController.addOneTagToImage,
  // addMultiTagsToImage: tagsController.addMultiTagsToImage,
  // getImageTags: tagsController.getImageTags,

  // getImageMetadata: imageController.getImageMetadata,
  // getImage: imageController.getImage,
  // getImageWithFilter: imageController.getImageWithFilter,
  // applyFilter: imageController.applyFilter,

  // registerUser: userController.registerUser,
  // confirmUser: userController.confirmUser,
  // loginUser: userController.loginUser,

  // getUserData: userController.getUserData,
  // updateUserData: userController.updateUserData
}

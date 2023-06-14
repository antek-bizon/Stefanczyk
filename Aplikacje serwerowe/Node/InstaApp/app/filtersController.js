const sharp = require('sharp')
const { sendSuccess } = require('./commonController')
const logger = require('tracer').colorConsole()

async function rotateImage(imagePath, { degrees }) {
  if (typeof degrees !== 'number') {
    logger.warn('No degrees specified')
    return false
  }
  const newImagePath = imagePath.replace(/\.\w+$/, `_rotate_${degrees}$&`)
  await sharp(imagePath)
    .rotate(degrees)
    .toFile(newImagePath)
  return newImagePath
}

async function resizeImage(imagePath, { width, height }) {
  if (typeof width !== 'number' || typeof height !== 'number') {
    logger.warn('No width or height specified')
    return false
  }

  const newImagePath = imagePath.replace(/\.\w+$/, `_${width}x${height}$&`)
  await sharp(imagePath)
    .resize(width, height)
    .toFile(newImagePath)
  return newImagePath
}

async function reformatImage(imagePath, { format }) {
  if (!format) {
    logger.warn('No format specified')
    return false
  }

  const newImagePath = imagePath.replace(/\.\w+$/, `.${format}`)
  await sharp(imagePath)
    .toFormat(format)
    .toFile(newImagePath)
  return newImagePath
}

async function cropImage(imagePath, { width, height, x, y }) {
  if (typeof width !== 'number' || typeof height !== 'number' || typeof x !== 'number' || typeof y !== 'number') {
    logger.warn('No width, height, x or y specified')
    return false
  }

  const newImagePath = imagePath.replace(/\.\w+$/, `_crop_${width}_${height}_${x}_${y}$&`)
  await sharp(imagePath)
    .extract({ width, height, left: x, top: y })
    .toFile(newImagePath)
  return newImagePath
}

async function grayscaleImage(imagePath) {
  const newImagePath = imagePath.replace(/\.\w+$/, '_grayscale$&')
  await sharp(imagePath)
    .grayscale()
    .toFile(newImagePath)
  return newImagePath
}

async function flipImage(imagePath) {
  const newImagePath = imagePath.replace(/\.\w+$/, '_flip$&')
  await sharp(imagePath)
    .flip()
    .toFile(newImagePath)
  return newImagePath
}

async function flopImage(imagePath) {
  const newImagePath = imagePath.replace(/\.\w+$/, '_flop$&')
  await sharp(imagePath)
    .flop()
    .toFile(newImagePath)
  return newImagePath
}

async function negateImage(imagePath) {
  const newImagePath = imagePath.replace(/\.\w+$/, '_negate$&')
  await sharp(imagePath)
    .negate()
    .toFile(newImagePath)
  return newImagePath
}

async function tintImage(imagePath, { r, g, b }) {
  if (typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number') {
    logger.warn('No r, g or b specified')
    return false
  }

  const newImagePath = imagePath.replace(/\.\w+$/, `_tint_${r}_${g}_${b}$&`)
  await sharp(imagePath)
    .tint({ r, g, b })
    .toFile(newImagePath)
  return newImagePath
}

const filters = {
  rotate: rotateImage,
  resize: resizeImage,
  reformat: reformatImage,
  crop: cropImage,
  grayscale: grayscaleImage,
  flip: flipImage,
  flop: flopImage,
  negate: negateImage,
  tint: tintImage
}

module.exports = {
  imageMetadata: async (imagePath) => {
    const meta = await sharp(imagePath).metadata()
    return meta
  },

  applyFilter: async (imagePath, filter, data) => {
    try {
      logger.log(filter)
      const filterFunction = filters[filter.toLowerCase()]

      if (filterFunction) {
        return await filterFunction(imagePath, data)
      }
      logger.warn(`Filter ${filter} not found`)
      return false
    } catch (e) {
      logger.error(e)
      return false
    }
  },

  getFilters: ({ res }) => {
    const filterNames = Object.keys(filters)
    return sendSuccess({ res, data: filterNames })
  }
}

const sharp = require('sharp')
const logger = require('tracer').colorConsole()

async function rotateImage (imagePath, { degrees }) {
  if (!degrees) {
    logger.warn('No degrees specified')
    return false
  }
  const newImagePath = imagePath.replace(/\.\w+$/, '_rotate$&')
  await sharp(imagePath)
    .rotate(degrees)
    .toFile(newImagePath)
  return true
}

async function resizeImage (imagePath, { width, height }) {
  if (!width || !height) {
    logger.warn('No width or height specified')
    return false
  }

  const newImagePath = imagePath.replace(/\.\w+$/, `_${width}x${height}$&`)
  await sharp(imagePath)
    .resize(width, height)
    .toFile(newImagePath)
  return true
}

async function reformatImage (imagePath, { format }) {
  if (!format) {
    logger.warn('No format specified')
    return false
  }

  const newImagePath = imagePath.replace(/\.\w+$/, `.${format}`)
  await sharp(imagePath)
    .toFormat(format)
    .toFile(newImagePath)
  return true
}

async function cropImage (imagePath, { width, height, x, y }) {
  if (!width || !height || !x || !y) {
    logger.warn('No width, height, x or y specified')
    return false
  }

  const newImagePath = imagePath.replace(/\.\w+$/, '_crop$&')
  await sharp(imagePath)
    .extract({ width, height, left: x, top: y })
    .toFile(newImagePath)
  return true
}

async function grayscaleImage (imagePath) {
  const newImagePath = imagePath.replace(/\.\w+$/, '_grayscale$&')
  await sharp(imagePath)
    .grayscale()
    .toFile(newImagePath)
  return true
}

async function flipImage (imagePath) {
  const newImagePath = imagePath.replace(/\.\w+$/, '_flip$&')
  await sharp(imagePath)
    .flip()
    .toFile(newImagePath)
  return true
}

async function flopImage (imagePath) {
  const newImagePath = imagePath.replace(/\.\w+$/, '_flop$&')
  await sharp(imagePath)
    .flop()
    .toFile(newImagePath)
  return true
}

async function negateImage (imagePath) {
  const newImagePath = imagePath.replace(/\.\w+$/, '_negate$&')
  await sharp(imagePath)
    .negate()
    .toFile(newImagePath)
  return true
}

async function tintImage (imagePath, { r, g, b }) {
  if (!r || !g || !b) {
    logger.warn('No r, g or b specified')
    return false
  }

  const newImagePath = imagePath.replace(/\.\w+$/, '_tint$&')
  await sharp(imagePath)
    .tint({ r, g, b })
    .toFile(newImagePath)
  return true
}

module.exports = {
  imageMetadata: async (imagePath) => {
    const meta = await sharp(imagePath).metadata()
    return meta
  },

  applyFilter: async (imagePath, filter, data) => {
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
    const filterFunction = filters[filter.toLowerCase()]

    if (filterFunction) {
      return await filterFunction(imagePath, data)
    }

    logger.warn(`Filter ${filter} not found`)
    return false
  }
}

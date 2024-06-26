const logger = require('tracer').colorConsole()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { sendError, sendSuccess } = require('./commonController')
const reqBodyController = require('./requestBodyController')
const fileController = require('./fileController')
const users = new Map()

module.exports = {
  users,
  registerUser: async ({ res, req }) => {
    try {
      const regInfo = JSON.parse(await reqBodyController.getRequestData(req))
      if (!regInfo || !regInfo.name || !regInfo.lastName || !regInfo.email || !regInfo.password) {
        logger.warn('Incorrect request data')
        return sendError({ res, status: 400, msg: 'Incorrect request data' })
      }

      if (users.has(regInfo.email)) {
        logger.warn('User already exists')
        return sendError({ res, status: 400, msg: 'User already exists' })
      }

      const hashPass = await bcrypt.hash(regInfo.password, 1)

      users.set(regInfo.email, {
        name: regInfo.name,
        lastName: regInfo.lastName,
        email: regInfo.email,
        confirmed: false,
        password: hashPass,
        picture: ''
      })

      const token = jwt.sign(
        {
          email: regInfo.email,
          anyData: Date.now().toString()
        },
        process.env.SECRET_KEY,
        {
          expiresIn: '5m'
        }
      )

      logger.log(users.get(regInfo.email))
      return sendSuccess({
        res,
        data: `http://localhost:${process.env.APP_PORT}/api/user/confirm/${token}`
      })
    } catch (e) {
      logger.error(e)
      return sendError({ res, status: 400, msg: 'JSON parse error' })
    }
  },

  loginUser: async ({ res, req }) => {
    try {
      const loginInfo = JSON.parse(await reqBodyController.getRequestData(req))
      if (!loginInfo || !loginInfo.email || !loginInfo.password) {
        logger.warn('Incorrect request data')
        return sendError({ res, status: 400, msg: 'Incorrect request data' })
      }

      const user = users.get(loginInfo.email)
      if (!user) {
        logger.warn('User not found')
        return sendError({ res, status: 401, msg: 'User not found' })
      }

      if (!user.confirmed) {
        logger.warn('User not confirmed')
        return sendError({ res, status: 401, msg: 'User not confirmed' })
      }

      const isPassCorrect = await bcrypt.compare(loginInfo.password, user.password)
      if (!isPassCorrect) {
        logger.warn('Wrong password')
        return sendError({ res, status: 400, msg: 'Wrong password' })
      }

      const token = jwt.sign(
        {
          email: loginInfo.email,
          anyData: Date.now().toString()
        },
        process.env.SECRET_KEY,
        {
          expiresIn: '1h'
        }
      )

      sendSuccess({
        res,
        data: {
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          token
        }
      })
    } catch (e) {
      logger.error(e)
      return sendError({ res, status: 400, msg: 'JSON parse error' })
    }
  },

  confirmUser: async ({ res, query }) => {
    if (!query) {
      logger.warn('Wrong query')
      return sendError({ res, status: 400, msg: 'Wrong query' })
    }

    try {
      const decoded = jwt.verify(query, process.env.SECRET_KEY)
      if (!decoded) {
        logger.warn('Wrong token')
        return sendError({ res, status: 400, msg: 'Wrong token' })
      }

      const user = users.get(decoded.email)
      if (!user) {
        logger.warn('User not found')
        return sendError({ res, msg: 'User not found' })
      }
      user.confirmed = true
      logger.log(user)
      return sendSuccess({ res, data: 'User confirmed' })
    } catch (e) {
      logger.warn('Token expired')
      return sendError({ res, status: 401, msg: 'Token expired' })
    }
  },

  getUserDataCookie: ({ res, user }) => {
    return sendSuccess({
      res,
      data: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        picture: user.picture
      }
    })
  },

  getAuthorData: async ({ res, req }) => {
    try {
      const authorInfo = JSON.parse(await reqBodyController.getRequestData(req))
      if (!authorInfo || !authorInfo.email) {
        logger.warn('Wrong query')
        return sendError({ res, status: 400, msg: 'Wrong query' })
      }

      const author = users.get(authorInfo.email)
      if (!author) {
        logger.warn('Author not found')
        return sendError({ res, status: 400, msg: 'Author not found' })
      }

      return sendSuccess({
        res,
        data: {
          name: author.name,
          lastName: author.lastName,
          email: author.email,
          picture: author.picture
        }
      })
    } catch (e) {
      logger.error(e)
      return sendError({ res, status: 400, msg: 'JSON parse error' })
    }
  },

  updateUserData: async ({ res, req, user }) => {
    try {
      const patchData = JSON.parse(await reqBodyController.getRequestData(req))
      logger.log(patchData)
      if (!patchData || !patchData.name || !patchData.lastName) {
        return sendError({ res, status: 400, msg: 'Wrong query' })
      }
      user.name = patchData.name
      user.lastName = patchData.lastName

      return sendSuccess({
        res,
        data: {
          name: user.name,
          lastName: user.lastName,
          email: user.email
        }
      })
    } catch (e) {
      logger.error(e)
      return sendError({ res, status: 400, msg: 'JSON parse error' })
    }
  },

  setProfilePicture: async ({ res, req, user }) => {
    try {
      const userToUpdate = users.get(user.email)

      if (!userToUpdate) {
        return sendError({ res, status: 400, msg: 'Wrong query' })
      }

      const fileInfo = await fileController.saveFile(req, user.email, true)
      if (!fileInfo || !fileInfo.url) {
        return sendError({ res, status: 400, msg: 'Wrong query' })
      }

      userToUpdate.picture = fileInfo.url
      return sendSuccess({ res, data: fileInfo.url })
    } catch (error) {
      console.error(error)
      return sendError({ res, status: 400, msg: 'Wrong query' })
    }
  },

  verifyUser: (token) => {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      if (!decoded) {
        return false
      }
      const user = users.get(decoded.email)
      if (!user || !user.confirmed) {
        return false
      }

      return user
    } catch (error) {
      return false
    }
  }
}

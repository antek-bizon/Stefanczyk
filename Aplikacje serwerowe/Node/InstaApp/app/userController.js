const logger = require('tracer').colorConsole()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { sendError, sendSuccess } = require('./commonController')
const reqBodyController = require('./requestBodyController')
const users = new Map()

module.exports = {
  registerUser: async ({ res, req }) => {
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
      password: hashPass
    })

    const token = jwt.sign(
      {
        email: regInfo.email,
        anyData: Date.now().toString()
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '1m'
      }
    )

    logger.log(users.get(regInfo.email))
    sendSuccess({
      res,
      data: `Skopiuj poniższy link do przeglądarki: http://localhost:3000/api/user/confirm/${token}`
    })
  },

  loginUser: async ({ res, req }) => {
    const loginInfo = JSON.parse(await reqBodyController.getRequestData(req))
    if (!loginInfo || !loginInfo.email || !loginInfo.password) {
      logger.warn('Incorrect request data')
      return sendError({ res, status: 400, msg: 'Incorrect request data' })
    }

    const user = users.get(loginInfo.email)
    if (!user) {
      logger.warn('User not found')
      return sendError({ res, msg: 'User not found' })
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
      data: token,
      otherHeaders: [{
        key: 'Authorization',
        value: `Bearer ${token}`
      }]
    })
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

  getUserData: ({ res, req }) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1]
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        if (!decoded) {
          return sendError({ res, status: 400, msg: 'Wrong token' })
        }

        const user = users.get(decoded.email)
        if (!user) {
          return sendError({ res, msg: 'User not found' })
        }

        if (!user.confirmed) {
          return sendError({ res, status: 401, msg: 'User not confirmed' })
        }

        return sendSuccess({
          res,
          data: {
            name: user.name,
            lastName: user.lastName,
            email: user.email
          }
        })
      } catch (e) {
        return sendError({ res, status: 401, msg: 'Token expired' })
      }
    }

    return sendError({ res, status: 401, msg: 'No token' })
  },

  updateUserData: async ({ res, req }) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1]
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        if (!decoded) {
          return sendError({ res, status: 400, msg: 'Wrong token' })
        }

        const user = users.get(decoded.email)
        if (!user) {
          return sendError({ res, msg: 'User not found' })
        }

        if (!user.confirmed) {
          return sendError({ res, status: 401, msg: 'User not confirmed' })
        }

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
        return sendError({ res, status: 401, msg: 'Token expired' })
      }
    }

    return sendError({ res, status: 401, msg: 'No token' })
  }
}

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
      return sendError({ res, msg: 'Incorrect request data' })
    }

    if (users.has(regInfo.email)) {
      logger.warn('User already exists')
      return sendError({ res, msg: 'User already exists' })
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
      data: JSON.stringify({
        mgs: `Skopiuj poniższy link do przeglądarki: http://localhost:3000/api/user/confirm/${token}`
      })
    })
  },

  confirmUser: async ({ res, query }) => {
    if (!query) {
      logger.warn('Wrong query')
      return sendError({ res, msg: 'Wrong query' })
    }

    try {
      const decoded = jwt.verify(query, process.env.SECRET_KEY)
      if (!decoded) {
        logger.warn('Wrong token')
        return sendError({ res, msg: 'Wrong token' })
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
      return sendError({ res, msg: 'Token expired' })
    }
  },

  loginUser: async ({ res, req }) => {
    const loginInfo = JSON.parse(await reqBodyController.getRequestData(req))
    if (!loginInfo || !loginInfo.email || !loginInfo.password) {
      logger.warn('Incorrect request data')
      return sendError({ res, msg: 'Incorrect request data' })
    }
    const user = users.get(loginInfo.email)
    if (!user) {
      logger.warn('User not found')
      return sendError({ res, msg: 'User not found' })
    }
    if (!user.confirmed) {
      logger.warn('User not confirmed')
      return sendError({ res, msg: 'User not confirmed' })
    }
    const isPassCorrect = await bcrypt.compare(loginInfo.password, user.password)
    if (!isPassCorrect) {
      logger.warn('Wrong password')
      return sendError({ res, msg: 'Wrong password' })
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
  }
}

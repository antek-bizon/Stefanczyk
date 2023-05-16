const http = require('http')
const router = require("./app/router")
const logger = require('tracer').colorConsole()
require('dotenv').config()

http
  .createServer((req, res) => router(req, res))
  .listen(process.env.APP_PORT, () => logger.info(`listen on ${process.env.APP_PORT}`))
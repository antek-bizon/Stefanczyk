const http = require('http')
const router = require("./app/router")
const PORT = 3000
const logger = require('tracer').colorConsole()

http
  .createServer((req, res) => router(req, res))
  .listen(PORT, () => logger.info("listen on", PORT))
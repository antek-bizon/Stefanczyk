const http = require('http')
const router = require("./app/router")
const PORT = 3000

http
  .createServer((req, res) => router(req, res))
  .listen(PORT, () => console.log("listen on", PORT))
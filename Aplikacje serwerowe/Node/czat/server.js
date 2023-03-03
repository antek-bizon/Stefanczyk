const http = require("http");
const fs = require("fs")
const path = require("path")
const mime = require('mime-types')
const logger = require('tracer').colorConsole();
const PORT = 3000;
const { Server } = require("socket.io");

const staticFolders = ["static"]

const server = http.createServer((req, res) => {
    console.log(`żądany przez przeglądarkę adres: ${req.url}`)

    let found = false

    for (let i = 0; i < staticFolders.length; i++) {
        const filepath = path.join(__dirname, staticFolders[i], req.url)
        if (fs.existsSync(filepath)) {
            fs.readFile(filepath, function (err, data) {
                const type = mime.lookup(filepath)
                res.writeHead(200, {
                    'Content-Type': `${type};charset=utf - 8`
                })
                res.write(data)
                res.end()
            })

            found = true
            break
        }
    }

    if (!found) {
        logger.warn("Page was not found:", req.url)
        fs.readFile("error/index.html", function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/html;charset=utf - 8'
            })
            res.write(data)
            res.end()
        })
    }
})

function searchForFile(url) {
    for (let i = 0; i < staticFolders.length; i++) {
        const filepath = path.join(__dirname, staticFolders[i], url)
        if (fs.existsSync(filepath)) {
            fs.readFile(filepath, function (err, data) {
                const type = mime.lookup(filepath)
                res.writeHead(200, {
                    'Content-Type': `${type};charset=utf - 8`
                })
                res.write(data)
                res.end()
            })

            found = true
            break
        }
    }
}

const socketio = new Server(server);

socketio.on('connection', (client) => {
    logger.info("New client connected", client.id)

    client.emit('onconnect', {
        clientId: client.id
    })
})

server.listen(PORT, () => {
    console.log(`serwer startuje na porcie ${PORT}`)
})

const WebSocket = require('ws')
const port = 3000

const wss = new WebSocket.Server(
  { port }, () => {
    console.log('ws startuje na porcie:', port)
  })

let mobileClient = null
let webClient = null

const broadcast = (ws, data) => {
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}

wss.on('connection', (ws, req) => {
  const clientip = req.connection.remoteAddress

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString())
      switch (data.route) {
        case 'data':
          if (mobileClient) {
            broadcast(ws, data.data)
          } else {
            console.log('no mobile client')
          }
          break
        case 'connected':
          if (data.type === 'mobile') {
            if (!mobileClient) {
              mobileClient = clientip
              console.log(clientip, 'mobile client successfully connected')
            } else {
              console.log('mobile client already connected')
              ws.close()
            }
          } else if (data.type === 'web') {
            if (!webClient) {
              webClient = clientip
              console.log(clientip, 'web client successfully connected')
            } else {
              console.log('web client already connected')
              ws.close()
            }
          } else {
            console.log('unknown type')
            ws.close()
          }
          break
        default:
          ws.send('serwer odsyła do klients -> ' + message)
      }
    } catch (e) {
      console.error(e)
    }
  })

  ws.on('close', () => {
    console.log(clientip, 'disconnected')
    if (mobileClient === clientip) {
      mobileClient = null
      broadcast(ws, { playerDisconnected: true })
    } else if (webClient === clientip) {
      webClient = null
    }
  })
})

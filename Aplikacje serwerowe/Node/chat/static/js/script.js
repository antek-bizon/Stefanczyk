
let usrName = null
do {
  usrName = window.prompt('Podaj nazwę')
} while (!usrName)

function wrapInSpan (className, text) {
  const span = document.createElement('span')
  span.classList.add(className)
  span.innerText = text
  return span
}

function formatTime (time) {
  const hours = (time.getHours() < 10 ? '0' : '') + time.getHours().toString()
  const minutes = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes().toString()
  const seconds = (time.getSeconds() < 10 ? '0' : '') + time.getSeconds().toString()
  return hours + ':' + minutes + ':' + seconds
}

function addNewMessage (sender, msg, time) {
  time = new Date(time)
  const formattedTime = formatTime(time)
  const msgItems = [
    wrapInSpan('sender', (sender === usrName) ? 'me' : sender),
    wrapInSpan('msgText', msg),
    wrapInSpan('time', formattedTime)
  ]
  const newMsg = document.createElement('div')
  newMsg.classList.add('message')
  newMsg.classList.add((sender === usrName) ? 'myMsg' : 'otherMsg')
  for (const i in msgItems) {
    newMsg.append(msgItems[i], (i < msgItems.length - 1) ? ' : ' : '')
  }

  document.getElementById('chat').append(newMsg)
}

window.onload = function () {
  const client = io()

  client.on('onconnect', (data) => {
    console.log(data.clientId)
    client.emit('myName', { usrName })
  })

  client.on('newUsr', (data) => {
    addNewMessage(data.usrName, 'wchodzi na czat', data.time)
  })

  client.on('incorrectName', (date) => {
    document.getElementById('usrName').innerText = 'Nazwa istnieje'
    window.location.reload()
  })

  client.on('newMessage', (data) => {
    addNewMessage(data.sender, data.msg, data.time)
  })

  client.on('usrDisconn', (data) => {
    addNewMessage(data.usrName, 'opuścił czat', data.time)
  })

  document.getElementById('usrName').innerText = 'Zalogowany: ' + usrName
  document.getElementById('send').onclick = () => {
    const input = document.getElementsByName('inputText')[0]
    if (input.value) {
      client.emit('sendMessage', {
        usrName,
        msg: input.value
      })
    }
    input.value = ''
  }
}

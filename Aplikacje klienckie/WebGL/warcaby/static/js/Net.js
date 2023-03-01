class Net {
  static client = null
  // static login (playerName) {
  //   const body = JSON.stringify({ name: playerName })
  //   const headers = { 'Content-Type': 'application/json' }

  //   fetch('/addPlayer', { method: 'post', body, headers })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.err === false) {
  //         Ui.successLogin()
  //         game.waitForPlayers(data.msg)
  //       } else {
  //         Ui.failedLogin()
  //         Ui.printError(data.msg)
  //       }
  //     })
  // }

  static resetPlayers () {
    console.log('reset players')
    const body = JSON.stringify({ reset: true })
    const headers = { 'Content-Type': 'application/json' }
    fetch('/resetPlayers', { method: 'post', body, headers })
      .catch((err) => {
        console.error('Error', err)
      })
  }

  static numberOfPlayers () {
    const body = null
    const headers = { 'Content-Type': 'application/json' }
    fetch('/numberOfPlayers', { method: 'post', body, headers })
      .then((res) => res.json())
      .then((data) => {
        console.log(game.numberOfPlayers, data.number)
        game.numberOfPlayers = data.number
      })
  }

  static connectSocket (name) {
    if (!Net.client) {
      Net.client = io()

      Net.client.on('onconnect', (data) => {
        console.log('connected', data.res)
        Net.client.emit('login', {
          res: name
        })
        Ui.setPlayerName(name)
        Ui.successLogin()
        game.waitForPlayers()
      })

      Net.client.on('start', (data) => {
        game.startGame(data.nr)
      })

      Net.client.on('nextMove', (data) => {
        game.nextMove(data.nowMoves, data.dataToSend)
      })

      Net.client.on('failedLogin', (data) => {
        Ui.failedLogin()
        Ui.printError(data.res)
      })

      Net.client.on('toManyPlayers', () => {
        Ui.failedLogin()
        Ui.printError('To many players')
      })

      Net.client.on('gameAlreadyStarted', () => {
        Ui.failedLogin()
        Ui.printError('Game already started')
      })

      Net.client.on('gameOver', (data) => {
        console.log(data)
        Ui.closeWaitingScreen()
        Ui.gameOverScreen(data.winner)
        setTimeout(() => {
          window.location.reload()
        }, 5000)
      })

      Net.client.on('gameEnd', () => {
        window.location.reload()
      })
    }
  }

  static makeMove (dataToSend) {
    Net.client.emit('makeMove', {
      dataToSend
    })
  }

  static noPieces (id) {
    Net.client.emit('noPieces', {
      id
    })
  }
}

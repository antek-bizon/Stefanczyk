class Ui {
  static bg = document.createElement('div')
  static playerName = document.createElement('h2')
  static dialog = Ui.createLoginMenu()
  static dialogOpened = false
  static timer
  static interval

  static createLoginMenu () {
    const dialog = document.createElement('dialog')
    Ui.bg.className = 'dialog-bg'

    const flex = document.createElement('div')
    flex.classList.add('flex')

    Ui.playerName.innerText = ''
    Ui.bg.append(Ui.playerName)

    const header = document.createElement('h2')
    Ui.bg.append(header)

    const p = document.createElement('input')
    p.type = 'text'

    const loginBtn = document.createElement('button')
    loginBtn.innerText = 'login'
    loginBtn.type = 'button'
    loginBtn.onclick = () => {
      const name = p.value
      Net.connectSocket(name)
    }
    const resetBtn = document.createElement('button')
    resetBtn.innerText = 'reset'
    resetBtn.type = 'button'
    resetBtn.onclick = (e) => {
      Net.resetPlayers()
    }
    flex.append(p)
    flex.append(loginBtn)
    flex.append(resetBtn)
    dialog.append(Ui.bg)
    dialog.append(flex)
    document.body.append(Ui.bg)
    document.body.append(dialog)
    return dialog
  }

  static showDialog () {
    if (Ui.dialogOpened !== true) {
      Ui.dialog.show()
      Ui.dialogOpened = true
    }
  }

  static hideDialog () {
    if (Ui.dialogOpened !== false) {
      Ui.dialog.close()
      Ui.dialogOpened = false
    }
  }

  static failedLogin () {
    Ui.dialog.classList.add('failed')
  }

  static successLogin () {
    if (Ui.dialog.classList.contains('failed')) {
      Ui.dialog.classList.remove('failed')
    }
    Ui.hideDialog()
  }

  static printError (msg) {
    window.alert(msg)
    window.location.reload()
  }

  static waitingScreen (timer) {
    Ui.bg.className = 'waiting-screen'

    if (timer) {
      Ui.reloadTimer(false)
    }
  }

  static reloadTimer (myTurn) {
    const seconds = 30
    Ui.timer = Date.now()

    if (Ui.interval) {
      clearInterval(Ui.interval)
      Ui.interval = null
    }

    const header = Ui.bg.lastChild
    header.innerText = 'Twoja tura: 30s'

    Ui.interval = setInterval(() => {
      const d = Date.now()

      if (myTurn) {
        header.innerText = `Twoja tura: ${Math.round((seconds * 1000 + (Ui.timer - d)) / 1000)}s`
      } else {
        header.innerText = `Tura przeciwnika: ${Math.round((seconds * 1000 + (Ui.timer - d)) / 1000)}s`
      }

      if (seconds * 1000 + (Ui.timer - d) < 0) {
        clearInterval(Ui.interval)
        Ui.interval = null
      }
    }, 1000)
  }

  static setPlayerName (name) {
    Ui.playerName.innerText = `Player: ${name}`
  }

  static closeWaitingScreen () {
    Ui.bg.className = ''
    Ui.reloadTimer(true)
  }

  static gameOverScreen (winner) {
    if (Ui.interval) {
      clearInterval(Ui.interval)
      Ui.interval = null
    }
    Ui.bg.className = 'game-over'
    Ui.bg.firstChild.innerText = 'Wygrywa: ' + winner
  }
}

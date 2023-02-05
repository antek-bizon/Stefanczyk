class Ui {
    constructor() { }
    static bg
    static dialog = Ui.createLoginMenu()
    static dialogOpened = false

    static createLoginMenu() {
        const dialog = document.createElement('dialog')
        Ui.bg = document.createElement('div')
        Ui.bg.className = 'dialog-bg'

        const flex = document.createElement('div')
        flex.classList.add('flex')

        const p = document.createElement('input')
        p.type = 'text'

        const loginBtn = document.createElement('button')
        loginBtn.innerText = 'login'
        loginBtn.type = 'button'
        loginBtn.onclick = async (e) => {
            const name = p.value
            Net.login(name)
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

    static showDialog() {
        if (Ui.dialogOpened !== true) {
            Ui.dialog.show()
            Ui.dialogOpened = true
        }
    }

    static hideDialog() {
        if (Ui.dialogOpened !== false) {
            Ui.dialog.close()
            Ui.dialogOpened = false
        }
    }

    static failedLogin() {
        Ui.dialog.classList.add('failed')
    }

    static successLogin() {
        if (Ui.dialog.classList.contains('failed')) {
            Ui.dialog.classList.remove('failed')
        }
        Ui.hideDialog()
    }

    static printError(msg) {
        window.alert(msg)
    }

    static waitingScreen() {
        Ui.bg.className = 'waiting-screen'
    }

    static closeWaitingScreen() {
        Ui.bg.className = ''
    }
}
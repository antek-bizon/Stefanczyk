class Net {
    constructor() { }

    static login(playerName) {
        const body = JSON.stringify({ name: playerName })
        const headers = { 'Content-Type': 'application/json' }

        fetch('/addPlayer', { method: 'post', body, headers })
            .then((res) => res.json())
            .then((data) => {
                if (data.err === false) {
                    Ui.successLogin()
                    game.waitForPlayers(data.msg)
                }
                else {
                    Ui.failedLogin()
                    Ui.printError(data.msg)
                }
            })
    }

    static resetPlayers() {
        console.log('reset players')
        const body = JSON.stringify({ reset: true })
        const headers = { 'Content-Type': 'application/json' }
        fetch('/resetPlayers', { method: 'post', body, headers })
            .catch((err) => {
                console.error('Error', err)
            })
    }

    static numberOfPlayers() {
        const body = null
        const headers = { 'Content-Type': 'application/json' }
        console.log(body, headers)
        fetch('/numberOfPlayers', { method: 'post', body, headers })
            .then((res) => res.json())
            .then((data) => {
                console.log(game.numberOfPlayers, data.number)
                game.numberOfPlayers = data.number
            })
    }
}
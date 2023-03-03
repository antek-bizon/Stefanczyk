
let usrName = null
do {
    usrName = window.prompt("Podaj nazwę")
} while (!usrName)


window.onload = function () {
    const client = io();

    client.on("onconnect", (data) => {
        console.log(data.clientId)
    })

    document.getElementById('usrName').innerText = usrName
}
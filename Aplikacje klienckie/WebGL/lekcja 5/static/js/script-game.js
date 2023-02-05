// let arr = [
//     { id: '0', x: 0, z: 0, dirOut: 0, dirIn: 3, type: 'wall' },
//     { id: '6', x: 2, z: 0, dirOut: 0, dirIn: 3, type: 'wall' },
//     { id: '12', x: 4, z: 0, dirOut: 0, dirIn: 3, type: 'wall' }
//   ]

// function fetchPost() {  
//     const body = JSON.stringify({ request: 'pliki' }) // body czyli przesyłane na serwer dane

//     const headers = { "Content-Type": "application/json" } // nagłowek czyli typ danych

//     const promise = fetch("/game-data", { method: "post", body, headers }) // fetch
//         .then(response => response.json())
//         .then(
//             data => {
//                 console.log(data)
//                 arr = data.request.level
//             } // dane odpowiedzi z serwera
//         )
// }

async function fetchPost() {  
    const body = JSON.stringify({ request: 'pliki' }) // body czyli przesyłane na serwer dane

    const headers = { "Content-Type": "application/json" } // nagłowek czyli typ danych

    const response = await fetch("/game-data", { method: "post", body, headers }) // fetch
    const data = await response.json()
    return data.request.level
}

//fetchPost()

window.addEventListener("load", async function () {
    const level = await fetchPost()
    const game = new Game(level)

    // na koniec jednokrotne wykonanie powyższej funkcji
    function render() {
        requestAnimationFrame(render)
        game.render()
    }

    render()
})
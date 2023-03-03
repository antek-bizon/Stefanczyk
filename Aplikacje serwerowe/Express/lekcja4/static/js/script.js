function fetchPost() {
        
    const body = JSON.stringify({ a: 1, b: 2, c: "fetch" }) // body czyli przesyłane na serwer dane

    const headers = { "Content-Type": "application/json" } // nagłowek czyli typ danych

    fetch("/api", { method: "post", body, headers }) // fetch
        .then(response => response.json())
        .then(
            data => console.log(data) // dane odpowiedzi z serwera
        )

}

function fetchPostTable(x, y) {
    const body = JSON.stringify({a: x, b: y, c: "fetch"})
    const header = { "Content-Type": "application/json" }

    fetch("/api", { method: "post", body, headers })
        .te
}

document.getElementById("post").onclick = fetchPost

document.getElementById("make").onclick = function () {
    console.log("make")
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const div = document.createElement("div")
            div.className = "tab"
            div.onclick = function () {
                
            }
            document.body.append(div)
        }
    }
}
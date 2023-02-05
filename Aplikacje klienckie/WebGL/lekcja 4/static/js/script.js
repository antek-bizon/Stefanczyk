function displayFiles(data) {
    data.forEach(e => {
        const p = document.createElement('a')
        p.setAttribute('href', e)
        p.innerText = e
        document.body.append(p)
        const hr = document.createElement('hr')
        document.body.append(hr)
    })
}

function fetchPost() {
        
    const body = JSON.stringify({ request: 'pliki' }) // body czyli przesyłane na serwer dane

    const headers = { "Content-Type": "application/json" } // nagłowek czyli typ danych

    fetch("/cwiczenia", { method: "post", body, headers }) // fetch
        .then(response => response.json())
        .then(
            data => displayFiles(data) // dane odpowiedzi z serwera
        )
}

fetchPost()
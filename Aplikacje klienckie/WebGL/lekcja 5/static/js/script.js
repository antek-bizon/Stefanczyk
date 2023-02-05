let info = {
    size: 0,
    level: []
}

let helperArr = {}

function fetchPost(data) {
    let body = JSON.stringify({ request: 0 }) // body czyli przesyłane na serwer dane
    if (data) {
        body = JSON.stringify({ request: data }) // body czyli przesyłane na serwer dane
    }
    const headers = { "Content-Type": "application/json" } // nagłowek czyli typ danych

    fetch("/config", { method: "post", body, headers }) // fetch
        .then(response => response.json())
        .then(
            data => {
                if (data.response == 0)
                    return
                
                info = data.response
                helperArr = {}
                data.response.level.forEach((e, i) => {
                    helperArr[e.id] = i
                });
                document.getElementById('hex-rows').value = info.size
                redraw()
            } // dane odpowiedzi z serwera
        )
}

function saveData() {
    console.log("saveData")
    fetchPost(info)
}

function loadData() {
    console.log("loadData")
    fetchPost()
}

function redraw() {
    info.size = parseInt(document.getElementById('hex-rows').value)
    drawInfo()
    drawGrid()
}

function drawInfo() {
    const div = document.getElementById('json')
    div.innerText = JSON.stringify(info, null, 2)
}

function updateInfo(id, i, j) {
    let found = false
    for (let k = 0; k < info.level.length; k++) {
        if (info.level[k].id == id) {
            found = true
            break
        }
    }
    if (!found) {
        helperArr[id] = info.level.length
        info.level.push({
            id: id,
            x: i,
            z: j,
            dirOut: 0,
            dirIn: 3,
            type: 'wall'
        })
    } else {
        info.level[helperArr[id]].dirOut = ++info.level[helperArr[id]].dirOut % 6
        info.level[helperArr[id]].dirIn = ++info.level[helperArr[id]].dirIn % 6 
    }
}

function drawGrid() {
    const rows = info.size
    const root = document.getElementById('grid')
    let index = 0
    root.replaceChildren()
    for (let i = 0; i < rows * 2; i++) {
        const container = document.createElement('div')
        container.classList.add('container')
        if (i % 2 !== 0) {
            container.classList.add('even')
        }
        for (let j = 0; j < 3; j++) {
            const div = document.createElement('div')
            const p = document.createElement('p')
            div.id = index++

            info.level.forEach((e) => {
                if (e.id == div.id) {
                    p.innerText = e.dirOut
                }
            })

            div.onclick = function () {
                updateInfo(this.id, i, j)
                p.innerText = info.level[helperArr[this.id]].dirOut
                drawInfo()
            }
            div.append(p)
            container.append(div)
        }
        root.append(container)
    }
}

document.getElementById('hex-rows').onchange = redraw
redraw()

function updateLines(textarea) {
    const lines = textarea.value.split('\n')

    const ul = document.getElementById('editor-rows')
    ul.innerHTML = ''
    for (let i = 0; i < lines.length; i++) {
        const li = document.createElement('li')
        li.innerText = `${i + 1}`
        ul.append(li)
    }
}

document.querySelector('textarea').onkeyup = function () {
    updateLines(this)
}

updateLines(document.querySelector('textarea'))
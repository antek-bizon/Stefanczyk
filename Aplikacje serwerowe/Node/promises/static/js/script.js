document.getElementById('start-server').onclick = function () {
  const options = {
    method: "POST",
  }

  fetch('/startStats', options)
    .catch(error => console.error(error))
}


let interval = null
document.getElementById('start-client').onclick = () => {
  if (!interval) {
    setInterval(() => {
      const options = {
        method: "POST",
      }

      fetch('/getStats', options)
        .then(res => res.json())
        .then(data => drawStats(data))
        .catch(error => console.error(error))
    }, 500)
  }
}

document.getElementById('stop-client').onclick = () => {
  if (interval) {
    clearInterval(interval)
  }
}

const statsDiv = document.getElementsByClassName('stats')[0]
function drawStats(data) {
  statsDiv.innerHTML = ''
  for (const memUsage of data.memUsage) {
    const div = document.createElement('div')
    div.style.height = `${memUsage / 1000000}px`
    statsDiv.append(div)
  }
}

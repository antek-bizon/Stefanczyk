const ranges = document.querySelectorAll('input')
const colorDiv = document.getElementById('color')
colorDiv.style.backgroundColor = `rgba(${ranges[0].value}, ${ranges[1].value}, ${ranges[2].value}, ${ranges[3].value})`
ranges.forEach((e) => {
  e.addEventListener('input', () => {
    const data = JSON.stringify({
      r: ranges[0].value,
      g: ranges[1].value,
      b: ranges[2].value,
      a: ranges[3].value
    })
    const options = {
      method: "POST",
      body: data
    }

    fetch('/color', options)
      .then(res => res.json())
      .then(data => {
        colorDiv.style.backgroundColor = `rgba(${data.r}, ${data.g}, ${data.b}, ${data.a})`
      }
      )
      .catch(error => console.log(error))
  })
})
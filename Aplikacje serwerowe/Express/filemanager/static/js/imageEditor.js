function setFilter (filter) {
  if (typeof filter !== 'undefined') {
    document.getElementsByClassName('mainImage')[0].style.filter = filter + '(100%)'
  } else {
    document.getElementsByClassName('mainImage')[0].style.filter = ''
  }
}

function toggleFiltersMenu () {
  const ul = document.getElementById('filtersMenu')
  ul.style.height = (ul.style.height === '0px') ? '550px' : '0px'
}

function saveImage (dir, name) {
  const div = document.getElementsByClassName('mainImage')[0]
  const imgWidth = parseInt(div.style.width)
  const imgHeight = parseInt(div.style.height)
  const filter = div.style.filter

  const image = new Image(imgWidth, imgHeight)
  image.src = div.style.backgroundImage.slice(4, -1).replace(/"/g, '')

  const canvas = document.querySelector('canvas')
  canvas.width = imgWidth
  canvas.height = imgHeight
  const ctx = canvas.getContext('2d')

  image.onload = () => {
    ctx.filter = filter
    ctx.drawImage(image, 0, 0)
    canvas.toBlob((blob) => {
      const formData = new FormData()
      formData.append('src', `${dir}/${name}`)
      formData.append('dir', dir)
      formData.append('name', name)
      formData.append('file', blob)

      const options = {
        method: 'POST',
        body: formData
      }

      fetch('/saveImage', options)
        .then((res) => res.json())
        .then((data) => {
          if (data.err === false) {
            window.confirm('Image was successfully saved')
          } else {
            window.alert('Error ocurred during saving')
          }
        })
    })
  }
}

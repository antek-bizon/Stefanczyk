function setFilter (filter) {
  if (typeof filter !== 'undefined') {
    document.getElementsByClassName('mainImage')[0].style.filter = filter + '(100%)'
  } else {
    document.getElementsByClassName('mainImage')[0].style.filter = ''
  }
}

function toggleFiltersMenu () {
  const ul = document.getElementById('filtersMenu')
  console.log(ul.style.height)
  ul.style.height = (ul.style.height === '0px') ? '550px' : '0px'
}

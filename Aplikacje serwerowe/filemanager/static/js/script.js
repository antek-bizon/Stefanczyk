function showDialog (text, dest, option) {
  const dialog = document.getElementById('dialog')
  const p = dialog.querySelector('p')
  p.innerText = text

  const form = dialog.querySelector('form')
  form.action = dest

  if (option) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.value = option
    input.name = 'option'
    form.append(input)
  }

  dialog.show()
}

function hideDialog () {
  document.getElementById('dialog').close()
}

function newFolder () {
  const text = 'Nazwa nowego folderu'
  const dest = '/newFolder'
  showDialog(text, dest)
}

function newTextFile () {
  const text = 'Nazwa nowego pliku'
  const dest = '/newFile'
  showDialog(text, dest)
}

function changeFolderName (name) {
  const text = 'Zmiana nazwy folderu: ' + name
  const dest = '/renameFolder'
  showDialog(text, dest)
}

function select () {
  document.getElementById('dialog-select').show()
}

function hideDialogSelect () {
  document.getElementById('dialog-select').close()
}

function changeFileName (name, option) {
  const text = 'Zmiana nazwy pliku: ' + name
  const dest = '/renameFile'
  showDialog(text, dest, option)
}

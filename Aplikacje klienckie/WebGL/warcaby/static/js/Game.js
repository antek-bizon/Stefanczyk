class Game {
  constructor () {
    this.numberOfPlayers = 10
    Ui.showDialog()
    const texture = new THREE.TextureLoader().load('../gfx/wood.jpg')

    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer()
    this.createCamera()
    this.renderer.setClearColor(0x666666)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.axes = new THREE.AxesHelper(500)
    this.scene.add(this.axes)
    this.drawBoard(texture)
    console.log(this.scene)
    this.markedSquares = []

    this.createPieces(texture)

    window.onresize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    document.getElementById('root').append(this.renderer.domElement)
    this.render()
  }

  createCamera () {
    this.camera = new THREE.PerspectiveCamera(60, 4 / 3, 0.1, 10000)
    console.log(this.id)
    this.camera.position.set(0, 200, 400)
    this.camera.lookAt(this.scene.position)
  }

  createRaycaster () {
    this.raycaster = new THREE.Raycaster()
    this.mouseVec = new THREE.Vector2()

    window.addEventListener('mousedown', (e) => {
      if (this.currentTurn !== this.id) return

      this.mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1
      this.mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1

      this.raycaster.setFromCamera(this.mouseVec, this.camera)
      const intersectsPieces = this.raycaster.intersectObjects(this.piecesModels[this.id])

      if (intersectsPieces.length > 0) {
        this.selectPiece(intersectsPieces)
      } else if (this.selectedPiece >= 0) {
        this.movePiece()
      }
    })
  }

  drawBoard (texture) {
    this.board = {
      white: [],
      black: []
    }
    const boardWidth = 8
    const boardHeigth = boardWidth
    const geometry = new THREE.BoxGeometry(50, 10, 50)
    const whiteMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      wireframe: false,
      transparent: true,
      opacity: 1,
      map: texture
    })

    for (let i = 0; i < boardHeigth; i++) {
      for (let j = 0; j < boardWidth; j++) {
        let box
        if ((i + j) % 2 === 0) {
          box = new THREE.Mesh(geometry, whiteMat)
          this.board.white.push(box)
        } else {
          box = new BoardSquare(geometry, i, j, texture)
          this.board.black.push(box)
        }
        box.position.set((i - 3.5) * 50, 0, (j - 3.5) * 50)
      }
    }
    this.board.white.forEach((e) => {
      this.scene.add(e)
    })
    this.board.black.forEach((e) => {
      this.scene.add(e)
    })
  }

  createPieces (texture) {
    this.pieces = [
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0]
    ]
    this.selectedPiece = -1
    this.piecesModels = {
      white: [],
      red: []
    }
    const geometry = new THREE.CylinderGeometry(20, 20, 20, 50)

    for (let i = 0; i < this.pieces.length; i++) {
      for (let j = 0; j < this.pieces[i].length; j++) {
        if (this.pieces[i][j] > 0) {
          let pieceModel
          if (this.pieces[i][j] === 1) {
            pieceModel = new Piece(geometry, 'white', j, i, texture)
            this.piecesModels.white.push(pieceModel)
          } else {
            pieceModel = new Piece(geometry, 'red', j, i, texture)
            this.piecesModels.red.push(pieceModel)
          }
          pieceModel.position.set((j - 3.5) * 50, 10, (i - 3.5) * 50)
        }
      }
    }
    this.piecesModels.white.forEach((e) => {
      this.scene.add(e)
    })
    this.piecesModels.red.forEach((e) => {
      this.scene.add(e)
    })
  }

  selectPiece (intersectsPieces) {
    const posArr = []
    for (let i = 0; i < this.piecesModels[this.id].length; i++) {
      if (this.piecesModels[this.id][i].uuid === intersectsPieces[0].object.uuid) {
        this.piecesModels[this.id][i].clicked()
        posArr.push(this.piecesModels[this.id][i].pos)
        if (this.selectedPiece === i) {
          this.selectedPiece = -1
        } else {
          if (this.selectedPiece !== -1) {
            this.piecesModels[this.id][this.selectedPiece].unclick()
            posArr.push(this.piecesModels[this.id][this.selectedPiece].pos)
          }
          this.selectedPiece = i
        }
        break
      }
    }

    posArr.forEach((e) => {
      this.markSquares(e)
    })
  }

  markSquares (pos) {
    const yOffset = (this.id === 'white') ? -1 : 1
    const oponentId = (this.id === 'white') ? 2 : 1
    if ((yOffset < 0 && pos.y > 0) || (yOffset > 0 && pos.y < this.pieces.length - 1)) {
      if (pos.x > 0) {
        if (this.pieces[pos.y + yOffset][pos.x - 1] === 0) {
          this.findSquare({ x: pos.x - 1, y: pos.y + yOffset })
        } else if (this.pieces[pos.y + yOffset][pos.x - 1] === oponentId) {
          if (pos.x > 1 && this.pieces[pos.y + yOffset * 2][pos.x - 2] === 0) {
            this.findSquare({ x: pos.x - 2, y: pos.y + yOffset * 2 })
          }
        }
      }

      if (pos.x < this.pieces[pos.y + yOffset].length) {
        if (this.pieces[pos.y + yOffset][pos.x + 1] === 0) {
          this.findSquare({ x: pos.x + 1, y: pos.y + yOffset })
        } else if (this.pieces[pos.y + yOffset][pos.x + 1] === oponentId) {
          if (yOffset > 0) {
            if (pos.y < this.pieces.length - 2 &&
              pos.x < this.pieces[pos.y + yOffset * 2].length - 2 &&
              this.pieces[pos.y + yOffset * 2][pos.x + 2] === 0) {
              this.findSquare({ x: pos.x + 2, y: pos.y + yOffset * 2 })
            }
          } else {
            if (pos.y > 1 &&
              pos.x < this.pieces[pos.y + yOffset * 2].length - 2 &&
              this.pieces[pos.y + yOffset * 2][pos.x + 2] === 0) {
              this.findSquare({ x: pos.x + 2, y: pos.y + yOffset * 2 })
            }
          }
        }
      }
    }
  }

  unmarkAllSquares () {
    for (let i = 0; i < this.board.black.length; i++) {
      this.board.black[i].unmark()
    }
  }

  findSquare (pos) {
    for (let i = 0; i < this.board.black.length; i++) {
      if (this.board.black[i].pos.x === pos.x &&
        this.board.black[i].pos.y === pos.y) {
        this.board.black[i].markAvailable()
      }
    }
  }

  canMove () {
    const intersectBoard = this.raycaster.intersectObjects(this.board.black)
    const side = (this.id === 'white') ? -1 : 1

    if (intersectBoard.length > 0) {
      const square = intersectBoard[0].object
      const currentPos = this.piecesModels[this.id][this.selectedPiece].pos
      console.log(square.pos, currentPos)
      if ((square.pos.x === currentPos.x + side || square.pos.x === currentPos.x - side) && square.pos.y === currentPos.y + side) {
        if (this.pieces[square.pos.y][square.pos.x] === 0) {
          return { action: 'move', square, currentPos }
        }
      } else {
        const toCapture = this.canCapture(square, currentPos, side)
        if (toCapture) {
          return { action: 'capture', square, currentPos, toCapture }
        }
      }
    }
    return false
  }

  canCapture (square, currentPos, side) {
    const oponentId = (this.id === 'white') ? 2 : 1

    if (square.pos.y === currentPos.y + side * 2) {
      if (square.pos.x === currentPos.x + side * 2) {
        if (this.pieces[square.pos.y][square.pos.x] === 0 && this.pieces[square.pos.y - side][square.pos.x - side] === oponentId) {
          return { x: square.pos.x - side, y: square.pos.y - side }
        }
      } else if (square.pos.x === currentPos.x - side * 2) {
        if (this.pieces[square.pos.y][square.pos.x] === 0 && this.pieces[square.pos.y - side][square.pos.x + side] === oponentId) {
          return { x: square.pos.x + side, y: square.pos.y - side }
        }
      }
    }
    return false
  }

  capturePiece (toCapture, id) {
    this.pieces[toCapture.y][toCapture.x] = 0
    for (let i = 0; i < this.piecesModels[id].length; i++) {
      if (this.piecesModels[id][i].pos.x === toCapture.x && this.piecesModels[id][i].pos.y === toCapture.y) {
        this.scene.remove(this.piecesModels[id][i])
        this.piecesModels[id].splice(i, 1)
        if (this.piecesModels[id].length === 0) {
          Net.noPieces(id)
        }
      }
    }
  }

  movePiece () {
    const check = this.canMove()
    if (!check) return

    switch (check.action) {
      case 'move':
        this.pieces[check.currentPos.y][check.currentPos.x] = 0
        this.piecesModels[this.id][this.selectedPiece].moveToSquare(check.square)
        this.pieces[check.square.pos.y][check.square.pos.x] = (this.id === 'white') ? 1 : 2
        break
      case 'capture':
        this.pieces[check.currentPos.y][check.currentPos.x] = 0
        this.piecesModels[this.id][this.selectedPiece].moveToSquare(check.square)
        this.pieces[check.square.pos.y][check.square.pos.x] = (this.id === 'white') ? 1 : 2
        // this.capturePiece(check.toCapture, this.oponentId)
        break
    }

    const dataToSend = {
      newBoard: this.pieces,
      id: this.id,
      pieceToMove: this.selectedPiece,
      modelPos: check.square.position,
      boardPos: check.square.pos,
      capturePos: check.toCapture,
      captureId: this.oponentId
    }

    Net.makeMove(dataToSend)
    this.piecesModels[this.id][this.selectedPiece].unclick()
    this.selectedPiece = -1
  }

  startGame (nr) {
    console.log(nr)
    this.createRaycaster()
    this.id = 'white'
    this.oponentId = 'red'
    this.currentTurn = 'white'
    if (nr === 1) {
      this.camera.position.z *= -1
      this.id = 'red'
      this.oponentId = 'white'
    }
    this.camera.lookAt(this.scene.position)

    this.nextMove()
  }

  nextMove (currentTurn, data) {
    if (currentTurn) {
      this.currentTurn = currentTurn
    }

    if (data) {
      // console.log('move', data)
      this.pieces = data.newBoard
      this.piecesModels[data.id][data.pieceToMove].moveToSquare({ position: data.modelPos, pos: data.boardPos })

      if (data.capturePos) {
        this.capturePiece(data.capturePos, data.captureId)
      }
    }

    if (this.currentTurn === this.id) {
      Ui.closeWaitingScreen()
    } else {
      this.unmarkAllSquares()
      Ui.waitingScreen(true)
    }
  }

  waitForPlayers () {
    Ui.waitingScreen()
    Net.connectSocket()
  }

  render = () => {
    requestAnimationFrame(this.render)
    TWEEN.update()
    this.renderer.render(this.scene, this.camera)
  }
}

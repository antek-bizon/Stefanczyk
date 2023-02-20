class Game {
  constructor() {
    this.numberOfPlayers = 10
    Ui.showDialog()

    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer()
    this.createCamera()
    this.renderer.setClearColor(0x666666)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.axes = new THREE.AxesHelper(500)
    this.scene.add(this.axes)
    this.drawBoard()
    console.log(this.scene)

    this.createPieces()

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

  drawBoard () {
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
      opacity: 1
    })

    for (let i = 0; i < boardHeigth; i++) {
      for (let j = 0; j < boardWidth; j++) {
        let box
        if ((i + j) % 2 === 0) {
          box = new THREE.Mesh(geometry, whiteMat)
          this.board.white.push(box)
        } else {
          box = new BoardSquare(geometry, i, j)
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

  createPieces () {
    // this.pieces = [
    //     [0, 2, 0, 2, 0, 2, 0, 2],
    //     [2, 0, 2, 0, 2, 0, 2, 0],
    //     [0, 0, 0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 0, 0],
    //     [0, 1, 0, 1, 0, 1, 0, 1],
    //     [1, 0, 1, 0, 1, 0, 1, 0],
    // ]
    this.pieces = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
    this.selectedPiece = -1
    this.piecesModels = {
      white: [],
      red: []
    }
    const geometry = new THREE.CylinderGeometry(20, 20, 20)

    for (let i = 0; i < this.pieces.length; i++) {
      for (let j = 0; j < this.pieces[i].length; j++) {
        if (this.pieces[i][j] > 0) {
          let pieceModel
          if (this.pieces[i][j] === 1) {
            pieceModel = new Piece(geometry, 'white', j, i)
            this.piecesModels.white.push(pieceModel)
          } else {
            pieceModel = new Piece(geometry, 'red', j, i)
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
    for (let i = 0; i < this.piecesModels[this.id].length; i++) {
      if (this.piecesModels[this.id][i].uuid === intersectsPieces[0].object.uuid) {
        console.log('clicked', this.piecesModels[this.id][i])
        this.piecesModels[this.id][i].clicked()
        console.log(this.selectedPiece)
        if (this.selectedPiece === i) {
          this.selectedPiece = -1
        } else {
          if (this.selectedPiece !== -1) {
            this.piecesModels[this.id][this.selectedPiece].unclick()
          }
          this.selectedPiece = i
        }
        console.log(this.selectedPiece)
        break
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
    return 0
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

  capturePiece (toCapture) {
    this.pieces[toCapture.y][toCapture.x] = 0
    for (let i = 0; i < this.piecesModels[this.oponentId].length; i++) {
      if (this.piecesModels[this.oponentId][i].pos.x === toCapture.x && this.piecesModels[this.oponentId][i].pos.y === toCapture.y) {
        this.scene.remove(this.piecesModels[this.oponentId][i])
        this.piecesModels[this.oponentId].splice(i, 1)
        break
      }
    }
  }

  movePiece () {
    const check = this.canMove()
    switch (check.action) {
      case 'move':
        this.pieces[check.currentPos.y][check.currentPos.x] = 0
        this.piecesModels[this.id][this.selectedPiece].moveToSquare(check.square)
        this.pieces[check.square.pos.y][check.square.pos.x] = 2
        break
      case 'capture':
        this.pieces[check.currentPos.y][check.currentPos.x] = 0
        this.piecesModels[this.id][this.selectedPiece].moveToSquare(check.square)
        this.pieces[check.square.pos.y][check.square.pos.x] = 2
        this.capturePiece(check.toCapture)
        break
    }
  }

  startGame (nr) {
    this.createRaycaster()
    Ui.closeWaitingScreen()
    this.id = 'white'
    this.oponentId = 'red'
    if (nr > 1) {
      this.camera.position.z *= -1
      this.id = 'red'
      this.oponentId = 'white'
    }
    console.log(this.id)
    this.camera.lookAt(this.scene.position)
  }

  waitForPlayers (nr) {
    Ui.waitingScreen()
    const waiting = setInterval(() => {
      Net.numberOfPlayers()
      if (this.numberOfPlayers === 2) {
        this.startGame(nr)
        clearInterval(waiting)
      }
    }, 600)
  }

  render = () => {
    requestAnimationFrame(this.render)
    this.renderer.render(this.scene, this.camera)
  }
}

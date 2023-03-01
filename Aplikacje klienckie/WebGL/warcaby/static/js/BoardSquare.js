class BoardSquare extends THREE.Mesh {
  constructor (geometry, x, y, texture) {
    const blackMat = new THREE.MeshBasicMaterial({
      color: 0x333333,
      side: THREE.DoubleSide,
      wireframe: false,
      transparent: true,
      opacity: 1,
      map: texture
    })

    super(geometry, blackMat)
    this.pos = { x, y }
    this.marked = false
  }

  markAvailable () {
    this.marked = !this.marked
    if (this.marked) {
      this.material.color.r = '0.1'
      this.material.color.g = '0.93'
      this.material.color.b = '0.1'
    } else {
      this.unmark()
    }
  }

  unmark () {
    this.marked = false
    this.material.color.r = '0.2'
    this.material.color.g = '0.2'
    this.material.color.b = '0.2'
  }
}

class Piece extends THREE.Mesh {
    constructor(geometry, material, x, y) {
        const whiteMat = new THREE.MeshBasicMaterial({
            color: 0xeeeeee,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            opacity: 1
        })
        const redMat = new THREE.MeshBasicMaterial({
            color: 0xdd0000,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            opacity: 1
        })
        if (material === 'white') {
            super(geometry, whiteMat)
        } else {
            super(geometry, redMat)
        }

        this.pos = {x: x, y: y}
        this.teamColor = material
        this.isClicked = false
    }

    clicked() {
        this.isClicked = !this.isClicked

        if (this.isClicked) {
            this.material.color.r = '0.86'
            this.material.color.g = '0.86'
            this.material.color.b = '0.0'
        } else {
            this.unclick()
        }
    }

    unclick() {
        this.isClicked = false
        if (this.teamColor === 'white') {
            this.material.color.r = '0.93'
            this.material.color.g = '0.93'
            this.material.color.b = '0.93'
        } else {
            this.material.color.r = '0.86'
            this.material.color.g = '0.0'
            this.material.color.b = '0.0'
        }
    }

    moveToSquare(square) {
        this.position.x = square.position.x
        this.position.y = square.position.y + 10
        this.position.z = square.position.z
        this.pos.x = square.pos.x
        this.pos.y = square.pos.y
    }
}
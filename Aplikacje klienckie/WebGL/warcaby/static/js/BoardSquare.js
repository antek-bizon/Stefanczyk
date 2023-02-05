class BoardSquare extends THREE.Mesh {
    constructor (geometry, x, y) {
        const blackMat = new THREE.MeshBasicMaterial({
            color: 0x333333,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            opacity: 1
        })

        super(geometry, blackMat)
        this.pos = {x: x, y: y}
    }
    
}
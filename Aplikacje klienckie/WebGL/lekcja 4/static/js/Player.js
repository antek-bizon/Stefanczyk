class Player {
    constructor() {
        this.container = new THREE.Object3D()
        const geometry = new THREE.BoxGeometry(100, 100, 100)
        const material = new THREE.MeshBasicMaterial({
            color: 0xff88ff,
            side: THREE.DoubleSide,
            wireframe: true,
            transparent: true,
            opacity: 1
        })
        this.player = new THREE.Mesh(geometry, material)
        this.player.name = "Player"
        this.container.add(this.player)
        this.axes = new THREE.AxesHelper(200)
        this.container.add(this.axes)
    }

    getPlayerCont() {
        return this.container
    }

    getPlayerAxes() {
        return this.axes
    }

    getPlayerMesh() {
        return this.player
    }
}
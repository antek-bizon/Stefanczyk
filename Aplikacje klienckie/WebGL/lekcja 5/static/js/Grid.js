class Grid {
    constructor() {
        this.container = new THREE.Object3D()
        this.geometry = new THREE.PlaneGeometry(1000, 1000, 5, 5)
        this.material = new THREE.MeshBasicMaterial({
            color: 0x8888ff,
            side: THREE.DoubleSide,
            wireframe: true,
            transparent: true,
            opacity: 0.7
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = "Grid"
        this.mesh.rotation.x = Math.PI / 2
        this.container.add(this.mesh)
    }

    getCont() {
        return this.container
    }

    getMesh() {
        return this.mesh
    }
}
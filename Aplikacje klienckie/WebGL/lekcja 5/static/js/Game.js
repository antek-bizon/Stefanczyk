class Game {
    constructor(arr) {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            45,    // (FOV - field of view)
            window.innerWidth / window.innerHeight,    // proporcje widoku, powinny odpowiadać proporcjom ekranu przeglądarki użytkownika
            0.1,    // minimalna renderowana odległość
            10000    // maksymalna renderowana odległość od kamery
        )
        this.renderer = new THREE.WebGLRenderer()

        this.camera.position.set(0, 1000, 0)
        this.camera.lookAt(this.scene.position)
        this.camera.
        this.renderer.setClearColor(0xffffff)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.getElementById("root").appendChild(this.renderer.domElement)

        const axes = new THREE.AxesHelper(1000)
        this.scene.add(axes)

        this.orbitControl = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        this.orbitControl.addEventListener("change", () => {
            this.renderer.render(this.scene, this.camera)
        })

        this.grid = new Grid()
        this.scene.add(this.grid.getCont())

        let lastDoor = -1
        for (let i = 0; i < arr.length; i++) {
            const doors = lastDoor !== -1 ? [arr[i].dirOut, lastDoor] : [arr[i].dirOut]
            console.log(doors, lastDoor)
            this.scene.add(new Hex3D(doors, {x: arr[i].x, z: arr[i].z}))
            lastDoor = arr[i].dirIn
        }
    }

    getCamera() {
        return this.camera
    }

    getScene() {
        return this.scene
    }

    render = () => {
        this.renderer.render(this.scene, this.camera)
    }
}

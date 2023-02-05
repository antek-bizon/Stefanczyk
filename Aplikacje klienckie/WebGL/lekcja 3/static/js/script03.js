function setCamera(scene) {
    const camera = new THREE.PerspectiveCamera(
        90,    // (FOV - field of view)
        window.innerWidth / window.innerHeight,    // proporcje widoku, powinny odpowiadać proporcjom ekranu przeglądarki użytkownika
        0.1,    // minimalna renderowana odległość
        10000    // maksymalna renderowana odległość od kamery
    );
    camera.position.set(200, 200, 200)
    camera.lookAt(scene.position);

    return camera
}

function setRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    return renderer
}

function addCube(scene) {
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        specular: 0xffffff,
        shininess: 50,
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load("mats/test.jpg",
            () => { },
            () => { },
            () => console.log("Error loading file")
        ),
    })
    return new THREE.Mesh(geometry, material);
}

function addGround() {
    const geometry = new THREE.PlaneGeometry(1000, 1000)
    const material = new THREE.MeshPhongMaterial({
        color: 0xbbbbbb,
        specular: 0xffffff,
        shininess: 50,
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load("mats/ground.jpg",
            () => { },
            () => { },
            () => console.log("Error loading file")
        ),
    })
    material.map.wrapS = THREE.RepeatWrapping
    material.map.wrapT = THREE.RepeatWrapping
    material.map.repeat.set(4, 4)

    return new THREE.Mesh(geometry, material);
}

class Light {
    constructor(parA, parB) {
        this.parA = parA
        this.parB = parB

        
    }
    setX(arg) {
        this.x = arg
    }
    getX() {
        return this.x
    }
}

window.addEventListener("load", function () {
    const scene = new THREE.Scene();
    const camera = setCamera(scene)

    const renderer = setRenderer()

    const axes = new THREE.AxesHelper(1000)
    scene.add(axes)

    const obj = new THREE.Object3D()
    const cube1 = addCube()
    cube1.position.set(100, 0, 0)
    const cube2 = addCube()
    cube2.position.set(0, 100, 0)
    const cube3 = addCube()
    cube3.position.set(0, 100, 0)
    obj.add(cube1)
    obj.add(cube2)
    obj.add(cube3)

    scene.add(obj)

    const ground = addGround()
    ground.rotateX(Math.PI / 2)
    ground.translateZ(100)
    scene.add(ground)

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    document.getElementById("root").appendChild(renderer.domElement);

    function render() {
        const range = document.getElementById("angle")
        const x = Math.sin(range.value / 10) * 250
        console.log(x)
        const y = Math.cos(range.value / 10) * 250

        cube1.position.set(x, 0, y)

        const rangeObj = document.getElementById("obj")
        const xObj = rangeObj.value
        obj.position.set(xObj, 0, 0)

        camera.updateProjectionMatrix();

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    // na koniec jednokrotne wykonanie powyższej funkcji

    render();
})
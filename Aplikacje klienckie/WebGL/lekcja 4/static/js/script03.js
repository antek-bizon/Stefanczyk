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
        map: new THREE.TextureLoader().load("/mats/ground.jpg",
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

window.addEventListener("load", function () {
    const scene = new THREE.Scene();
    const camera = setCamera(scene)
    const loader = new THREE.JSONLoader();
    const renderer = setRenderer()

    const axes = new THREE.AxesHelper(1000)
    scene.add(axes)

    const grid = new Grid()
    scene.add(grid.GetMesh())

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const modelMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("/mats/mario/mario2.jpg"), // dowolny plik png, jpg
        morphTargets: true // ta własność odpowiada za możliwość animowania materiału modelu
    });

    loader.load('/mats/mario/mario.json', function (geometry) {
        console.log(geometry)
        meshModel = new THREE.Mesh(geometry, modelMaterial)
        meshModel.name = "name";
        meshModel.rotation.y = 0; // ustaw obrót modelu
        meshModel.position.y = 0; // ustaw pozycje modelu
        meshModel.scale.set(3, 3, 3); // ustaw skalę model

        //

        scene.add(meshModel);

        // tutaj animacje z punktu 9

    });

    document.body.appendChild(renderer.domElement);

    function render() {
        camera.updateProjectionMatrix();

        //camera.rotateY(Math.PI / 150)

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    // na koniec jednokrotne wykonanie powyższej funkcji

    render();
})
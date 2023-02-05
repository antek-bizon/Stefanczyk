window.addEventListener("load", function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        90,    // (FOV - field of view)
        window.innerWidth / window.innerHeight,    // proporcje widoku, powinny odpowiadać proporcjom ekranu przeglądarki użytkownika
        0.1,    // minimalna renderowana odległość
        10000    // maksymalna renderowana odległość od kamery
    );
    camera.position.set(100, 100, 100)
    camera.lookAt(scene.position);

    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x00bbff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const axes = new THREE.AxesHelper(1000)
    scene.add(axes)

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
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const light = new THREE.SpotLight(0xffffff, 1);
    light.position.set(100, 100, 100);
    light.target = scene;
    scene.add(light);

    document.getElementById("root").appendChild(renderer.domElement);

    function render() {
        cube.rotateY(0.01)
        camera.updateProjectionMatrix();

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    // na koniec jednokrotne wykonanie powyższej funkcji

    render();
})
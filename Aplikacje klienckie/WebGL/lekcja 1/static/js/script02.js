window.addEventListener("load", function(){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45,    // (FOV - field of view)
        window.innerWidth/window.innerHeight,    // proporcje widoku, powinny odpowiadać proporcjom ekranu przeglądarki użytkownika
        0.1,    // minimalna renderowana odległość
        10000    // maksymalna renderowana odległość od kamery
    );
    camera.position.set(100,100,100)
    camera.lookAt(scene.position);

    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x00bbff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const axes = new THREE.AxesHelper(1000)
    scene.add(axes)

    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshBasicMaterial({
                    color: 0x8888ff,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    transparent: true,
                    opacity: 0.7
                });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    document.getElementById("root").appendChild( renderer.domElement );

    function render() {
        cube.rotation.y += 0.01;

        const fov = document.getElementById('fov')
        camera.fov = fov.value;
        camera.updateProjectionMatrix();

        requestAnimationFrame(render);

        console.log("render leci")
            
        renderer.render(scene, camera);
    }

    // na koniec jednokrotne wykonanie powyższej funkcji

    render();
})
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

    document.getElementById("root").appendChild( renderer.domElement );

    function render() {
        //mesh.rotation.y += 0.01;
        requestAnimationFrame(render);

        console.log("render leci")
            
        renderer.render(scene, camera);
    }

    // na koniec jednokrotne wykonanie powyższej funkcji

    render();
})
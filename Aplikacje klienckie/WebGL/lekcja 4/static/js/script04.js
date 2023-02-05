window.addEventListener("load", function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        100,    // (FOV - field of view)
        window.innerWidth / window.innerHeight,    // proporcje widoku, powinny odpowiadać proporcjom ekranu przeglądarki użytkownika
        0.1,    // minimalna renderowana odległość
        10000    // maksymalna renderowana odległość od kamery
    );
    camera.position.set(100, 100, 100)
    camera.lookAt(scene.position);

    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xdddddd);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const axes = new THREE.AxesHelper(1000)
    //scene.add(axes)

    const player = new Player()
    scene.add(player.getPlayerCont())

    const grid = new Grid()
    scene.add(grid.getCont())

    const raycaster = new THREE.Raycaster()
    const mouseVector = { x: 0, y: 0 }
    let clickedVect = new THREE.Vector3(0, 0, 0)
    let directionVect = new THREE.Vector3(0, 0, 0)

    document.body.appendChild(renderer.domElement);

    this.window.addEventListener("mousedown", function (e) {
        const intersects = raycaster.intersectObjects(scene.children)
        mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1
        mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1
        raycaster.setFromCamera(mouseVector, camera)

        if (intersects.length > 0) {
            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].object.name != "Grid") {
                    continue
                }

                clickedVect = intersects[i].point
                console.log(clickedVect)

                directionVect = clickedVect.clone().sub(player.getPlayerCont().position).normalize()
                console.log(directionVect)
            }

        }
    })

    function render() {
        camera.position.x = player.getPlayerCont().position.x
        camera.position.z = player.getPlayerCont().position.z + 200
        camera.position.y = player.getPlayerCont().position.y + 200
        camera.lookAt(player.getPlayerCont().position)
        camera.updateProjectionMatrix();

        const angle = Math.atan2(
            player.getPlayerCont().position.clone().x - clickedVect.x,
            player.getPlayerCont().position.clone().z - clickedVect.z
        )

        player.getPlayerMesh().rotation.y = angle
        player.getPlayerAxes().rotation.y = angle + Math.PI * 0.5

        console.log(player.getPlayerCont().position.clone().distanceTo(clickedVect))
        if (player.getPlayerCont().position.clone().distanceTo(clickedVect) > 10)
            player.getPlayerCont().translateOnAxis(directionVect, 5)

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    // na koniec jednokrotne wykonanie powyższej funkcji

    render();
})
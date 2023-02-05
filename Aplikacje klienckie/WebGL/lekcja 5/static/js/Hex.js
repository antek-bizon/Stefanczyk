class Hex3D {
    constructor(doors, pos) {

        const radius = 100 // zmienna wielkość hexagona
        const wallWidth = 118.5

        const container = new THREE.Object3D() // kontener na obiekty 3D

        const wallGeometry = new THREE.BoxGeometry(wallWidth, 100, 5)
        const doorGeometry = new THREE.BoxGeometry(30, 100, 5)
        const material = new THREE.MeshNormalMaterial({
            //color: 0xff8888,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            opacity: 0.7
        })

        const wall = new THREE.Mesh(wallGeometry, material) // prostopadłościan - ściana hex-a
        const door = new THREE.Mesh(doorGeometry, material)
        const floor = new THREE.Mesh()

        for (var i = 0; i < 6; i++) {
            let addDoor = false
            const angle = (Math.PI / 3) * i
            if (doors && doors.includes(i)) {
                addDoor = true
            }
            if (addDoor) {
                let side = door.clone()  // klon ściany
                side.position.x = Math.cos(angle) * radius // punkt na okręgu, do obliczenia
                side.position.z = Math.sin(angle) * radius // punkt na okręgu, do obliczenia      
                side.lookAt(container.position)  // nakierowanie ściany na środek kontenera 3D  
                side.position.x -= Math.sin(angle) * (wallWidth - 30) / 2 
                side.position.z += Math.cos(angle) * (wallWidth - 30) / 2 
                container.add(side)   // dodanie ściany do kontenera

                side = door.clone()  // klon ściany
                side.position.x = Math.cos(angle) * radius // punkt na okręgu, do obliczenia
                side.position.z = Math.sin(angle) * radius // punkt na okręgu, do obliczenia      
                side.lookAt(container.position)  // nakierowanie ściany na środek kontenera 3D  
                side.position.x += Math.sin(angle) * (wallWidth - 30) / 2 
                side.position.z -= Math.cos(angle) * (wallWidth - 30) / 2 
                container.add(side)   // dodanie ściany do kontenera
            } else {
                const side = wall.clone()  // klon ściany
                side.position.x = Math.cos(angle) * radius // punkt na okręgu, do obliczenia
                side.position.z = Math.sin(angle) * radius
                side.lookAt(container.position)  // nakierowanie ściany na środek kontenera 3D  
                container.add(side)   // dodanie ściany do kontenera
            }
        }

        const offset = pos.x % 2
        container.position.set(pos.x * -radius, 0, (pos.z + offset) * 175)

        return container
    }

}
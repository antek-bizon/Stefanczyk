import * as THREE from 'three'
import { createNoise2D } from 'simplex-noise'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
const clock = new THREE.Clock()

const player = generatePlayer()
const genNoise = createNoise2D()
const tileSize = 150 // Adjust as needed
const tilesPerRow = 14 // Adjust as needed
let terrainGrid = []
let delta = 0
const playerData = { x: 0, y: 0, z: 0, connected: false }
// let fps = 0

connect()
createInitialTerrain()
setup()
run()

function connect () {
  const serverIp = 'localhost:3000'
  const url = 'ws://' + serverIp
  const ws = new WebSocket(url)
  ws.onopen = () => {
    ws.send(JSON.stringify({ route: 'connected', type: 'web' }))
  }
  ws.onclose = (e) => {
    playerData.connected = false
  }
  ws.onmessage = ({ data }) => {
    const coords = JSON.parse(data)
    if (coords.playerDisconnected) {
      playerData.connected = false
    } else {
      playerData.x = coords.x
      playerData.y = coords.y
      playerData.z = coords.z
      playerData.connected = true
    }
  }
  ws.onerror = (e) => {
    console.error(e.message)
  }
}

function setup () {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
  scene.add(ambientLight)
  scene.fog = new THREE.FogExp2(0xcccccc, 0.005)
  scene.background = new THREE.Color(0xcccccc)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
  window.addEventListener('resize', onWindowResize, false)
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

export function run () {
  window.requestAnimationFrame(run)
  delta += clock.getDelta()
  if (delta >= 0.02) {
    updatePlayer()
    delta = delta - 0.02
  }

  update()

  camera.position.x = player.position.x
  camera.position.y = player.position.y + 2
  camera.position.z = player.position.z - 5
  camera.lookAt(player.position)
  renderer.render(scene, camera)
  // fps++
}

function update () {
  // Check if the player has moved to a new tile
  const playerTileX = Math.floor((player.position.x + tileSize) / tileSize)
  const playerTileY = Math.floor(player.position.z / tileSize)

  // Update terrain tiles based on player's position
  updateTerrain(playerTileX, playerTileY)
}

function updatePlayer () {
  if (playerData.connected) {
    const { x, y, z } = playerData
    // console.log(x, y, z)
    const rotateX = -Math.PI * y / 200
    const rotateZ = -Math.PI * x / 200
    const rotateY = x * Math.PI / 10_000
    player.rotation.set(rotateX, player.rotation.y + rotateY, rotateZ)
    player.translateZ(1)
  }
}

function generatePlayer () {
  const geometry = new THREE.BoxGeometry(1, 1, 5)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const player = new THREE.Mesh(geometry, material)
  player.position.x = 80
  player.position.y = 50
  player.position.z = 50
  scene.add(player)
  return player
}

function createInitialTerrain () {
  for (let i = 0; i < tilesPerRow; i++) {
    terrainGrid[i] = []
    for (let j = 0; j < tilesPerRow; j++) {
      const tile = createTile(i, j)
      scene.add(tile)
      terrainGrid[i][j] = tile
    }
  }
}

function updateTerrain (playerTileX, playerTileY) {
  // Determine which tiles should be visible
  const visibleTiles = []
  for (let i = 0; i < tilesPerRow; i++) {
    for (let j = 0; j < tilesPerRow; j++) {
      const tileX = playerTileX - Math.floor(tilesPerRow / 2) + i
      const tileY = playerTileY - Math.floor(tilesPerRow / 2) + j
      visibleTiles.push({ x: tileX, y: tileY })
    }
  }

  // Remove old tiles that are no longer visible
  terrainGrid.forEach(row => {
    for (let i = 0; i < row.length; i++) {
      const tile = row[i]
      const tilePos = tile.position
      const isTileVisible = visibleTiles.some(({ x, y }) => {
        return x === Math.floor(tilePos.x / tileSize) && y === Math.floor(tilePos.z / tileSize)
      })

      if (!isTileVisible) {
        scene.remove(tile)
        row[i] = null
      }
    }
  })

  terrainGrid = terrainGrid
    .map(row => row.filter(tile => tile !== null))
    .filter(row => row.length > 0)

  // if (fps % 120 === 0) {
  //   console.log(terrainGrid.length)
  // }

  // Generate and add new tiles that became visible
  visibleTiles.forEach(({ x, y }) => {
    const isTileExists = terrainGrid.some(row => row.some(tile => {
      const tilePos = tile.position
      return x === Math.floor(tilePos.x / tileSize) && y === Math.floor(tilePos.z / tileSize)
    }))

    if (!isTileExists) {
      const newTile = createTile(x, y)
      scene.add(newTile)
      terrainGrid.push([newTile])
    }
  })
}

function createTile (x = 0, y = 0) {
  const size = tileSize
  const geometry = createTerrainGeometry(size, size, x * size, y * size)

  // const material = new THREE.ShaderMaterial({
  //   vertexShader: document.getElementById('vertexShader').textContent,
  //   fragmentShader: document.getElementById('fragmentShader').textContent
  // })

  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x5ccaa0),
    metalness: 0.1, // Metallic reflection
    roughness: 0.9
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  mesh.position.setX(x * size)
  mesh.position.setZ(y * size)

  return mesh
}

function createTerrainGeometry (width, height, startX, startY) {
  const widthSegments = 25
  const heightSegments = 25
  const scale = 20
  const zoomX = 30
  const zoomY = 30

  const geometry = new THREE.BufferGeometry()

  const widthHalf = width / 2
  const heightHalf = height / 2

  const gridX = widthSegments || 1
  const gridY = heightSegments || 1

  const gridX1 = gridX + 1
  const gridY1 = gridY + 1

  const segmentWidth = width / gridX
  const segmentHeight = height / gridY

  const vertices = new Float32Array(gridX1 * gridY1 * 3)
  const normals = new Float32Array(gridX1 * gridY1 * 3)
  const uvs = new Float32Array(gridX1 * gridY1 * 2)

  let offset = 0

  for (let iy = 0; iy < gridY1; iy++) {
    const y = iy * segmentHeight - heightHalf

    for (let ix = 0; ix < gridX1; ix++) {
      const x = ix * segmentWidth - widthHalf

      vertices[offset] = x
      vertices[offset + 1] = -y // Negate y to match Three.js convention
      vertices[offset + 2] = (genNoise((x + startX) / zoomX, (-y - startY) / zoomY) + 1) * scale

      normals[offset] = 0
      normals[offset + 1] = 0
      normals[offset + 2] = 1

      uvs[offset] = ix / gridX
      uvs[offset + 1] = 1 - (iy / gridY)

      offset += 3
    }
  }

  const indices = []

  for (let iy = 0; iy < gridY; iy++) {
    for (let ix = 0; ix < gridX; ix++) {
      const a = ix + gridX1 * iy
      const b = ix + gridX1 * (iy + 1)
      const c = (ix + 1) + gridX1 * (iy + 1)
      const d = (ix + 1) + gridX1 * iy

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  geometry.setIndex(indices)
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))

  return geometry
}

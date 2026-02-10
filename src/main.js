import './style.css';
import * as THREE from 'three';
import { applyInput, reachedGoal, stepPhysics } from './gameLogic';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('#app').appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const grass = textureLoader.load('/assets/2026-02-10-16-53-15-grass-texture.png');
const stone = textureLoader.load('/assets/2026-02-10-16-53-50-stone-texture.png');
const sky = textureLoader.load('/assets/2026-02-10-16-54-23-skybox-bg.png');
[grass, stone].forEach((t) => {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 2);
});
scene.background = sky;

scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 1.0));
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(4, 10, 2);
scene.add(dir);

const platforms = [
  { x: 0, y: 0, z: 0, width: 10, depth: 10, height: 1 },
  { x: 8, y: 2, z: -2, width: 6, depth: 6, height: 1 },
  { x: 14, y: 4, z: 2, width: 5, depth: 5, height: 1 },
  { x: 20, y: 7, z: 0, width: 7, depth: 7, height: 1 },
];

for (const p of platforms) {
  const g = new THREE.BoxGeometry(p.width, p.height, p.depth);
  const m = [
    new THREE.MeshStandardMaterial({ map: stone }),
    new THREE.MeshStandardMaterial({ map: stone }),
    new THREE.MeshStandardMaterial({ map: grass }),
    new THREE.MeshStandardMaterial({ map: stone }),
    new THREE.MeshStandardMaterial({ map: stone }),
    new THREE.MeshStandardMaterial({ map: stone }),
  ];
  const mesh = new THREE.Mesh(g, m);
  mesh.position.set(p.x, p.y, p.z);
  scene.add(mesh);
}

const playerMesh = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.4, 1, 4, 8),
  new THREE.MeshStandardMaterial({ color: 0xffcc00 })
);
scene.add(playerMesh);

const goal = { x: 20, y: 8.5, z: 0, radius: 1.4 };
const goalMesh = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.6, 0.2, 120, 16),
  new THREE.MeshStandardMaterial({ color: 0xff3b3b, emissive: 0x551111 })
);
goalMesh.position.set(goal.x, goal.y, goal.z);
scene.add(goalMesh);

const player = {
  position: { x: 0, y: 3, z: 0 },
  velocity: { x: 0, y: 0, z: 0 },
  onGround: false,
  height: 1.8,
  spawn: { x: 0, y: 3, z: 0 },
};

const input = { left: false, right: false, forward: false, backward: false, jump: false };
const map = {
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  Space: 'jump',
};

window.addEventListener('keydown', (e) => {
  const key = map[e.code];
  if (key) input[key] = true;
});
window.addEventListener('keyup', (e) => {
  const key = map[e.code];
  if (key) input[key] = false;
});

camera.position.set(-6, 7, 12);
const status = document.querySelector('#status');

let win = false;
let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.04);
  last = now;

  applyInput(player, input);
  const next = stepPhysics(player, dt, platforms);
  Object.assign(player.position, next.position);
  Object.assign(player.velocity, next.velocity);
  player.onGround = next.onGround;

  if (!win && reachedGoal(player.position, goal)) {
    win = true;
    status.textContent = 'YOU WIN, PUNY HUMAN!';
  }

  playerMesh.position.set(player.position.x, player.position.y, player.position.z);
  goalMesh.rotation.y += 0.02;

  camera.lookAt(playerMesh.position);
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

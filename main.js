import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

const app = document.querySelector('#app');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1020);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 4.2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(renderer.domElement);

const geometry = new THREE.TorusKnotGeometry(1, 0.32, 160, 24);
const material = new THREE.MeshStandardMaterial({
  color: 0x62d2ff,
  metalness: 0.35,
  roughness: 0.25
});
const knot = new THREE.Mesh(geometry, material);
scene.add(knot);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(2.8, 96),
  new THREE.MeshStandardMaterial({
    color: 0x1a2444,
    roughness: 0.8,
    metalness: 0.05
  })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.35;
scene.add(floor);

scene.add(new THREE.AmbientLight(0xffffff, 0.45));

const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
keyLight.position.set(3, 4, 5);
scene.add(keyLight);

const fillLight = new THREE.PointLight(0x88aaff, 1.6, 10);
fillLight.position.set(-3, 1.5, -2);
scene.add(fillLight);

const starPositions = [];
for (let i = 0; i < 300; i += 1) {
  starPositions.push(
    (Math.random() - 0.5) * 18,
    (Math.random() - 0.5) * 18,
    (Math.random() - 0.5) * 18
  );
}
const stars = new THREE.Points(
  new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3)),
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.018 })
);
scene.add(stars);

let isDragging = false;
let previousX = 0;
let previousY = 0;
let targetRotationX = 0;
let targetRotationY = 0;

window.addEventListener('pointerdown', (event) => {
  isDragging = true;
  previousX = event.clientX;
  previousY = event.clientY;
});

window.addEventListener('pointerup', () => {
  isDragging = false;
});

window.addEventListener('pointermove', (event) => {
  if (!isDragging) return;
  const deltaX = event.clientX - previousX;
  const deltaY = event.clientY - previousY;
  previousX = event.clientX;
  previousY = event.clientY;
  targetRotationY += deltaX * 0.01;
  targetRotationX += deltaY * 0.01;
});

window.addEventListener('wheel', (event) => {
  camera.position.z = Math.min(7, Math.max(2.2, camera.position.z + event.deltaY * 0.002));
});

function animate() {
  requestAnimationFrame(animate);
  knot.rotation.x += 0.006;
  knot.rotation.y += 0.01;
  knot.rotation.x += (targetRotationX - knot.rotation.x) * 0.035;
  knot.rotation.y += (targetRotationY - knot.rotation.y) * 0.035;
  stars.rotation.y += 0.0008;
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

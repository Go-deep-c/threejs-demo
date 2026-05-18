import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

const app = document.querySelector('#app');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1020);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1.2, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
app.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.55));
const light = new THREE.DirectionalLight(0xffffff, 2.4);
light.position.set(4, 6, 5);
scene.add(light);
const blue = new THREE.PointLight(0x62d2ff, 1.6, 15);
blue.position.set(-4, 2, -3);
scene.add(blue);

const metal = new THREE.MeshStandardMaterial({ color: 0x8793a6, metalness: 0.8, roughness: 0.28 });
const dark = new THREE.MeshStandardMaterial({ color: 0x1e2a3a, metalness: 0.65, roughness: 0.4 });
const glow = new THREE.MeshStandardMaterial({ color: 0x62d2ff, emissive: 0x123040, metalness: 0.8, roughness: 0.2 });

const floor = new THREE.Mesh(new THREE.CircleGeometry(8, 96), new THREE.MeshStandardMaterial({ color: 0x172342, roughness: 0.8 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.55;
scene.add(floor);

const robot = new THREE.Group();
robot.rotation.y = -0.35;
scene.add(robot);

function box(w, h, d, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
}

robot.add(box(2.4, 0.75, 1.05, metal, 0, 0.2, 0));
robot.add(box(1.4, 0.18, 0.82, dark, -0.15, 0.68, 0));
robot.add(box(0.25, 0.34, 0.42, dark, 1.25, 0.42, 0));

const head = new THREE.Group();
head.position.set(1.7, 0.45, 0);
head.add(box(0.72, 0.52, 0.6, metal));
head.add(box(0.32, 0.2, 0.32, dark, 0.48, -0.06, 0));
head.add(box(0.08, 0.08, 0.08, glow, 0.2, 0.08, 0.18));
head.add(box(0.08, 0.08, 0.08, glow, 0.2, 0.08, -0.18));
robot.add(head);

robot.add(box(1.0, 0.25, 0.07, glow, 0.08, 0.2, 0.58));
robot.add(box(1.0, 0.25, 0.07, glow, 0.08, 0.2, -0.58));

const tail = new THREE.Group();
tail.position.set(-1.32, 0.35, 0);
const tailMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 0.75, 10), dark);
tailMesh.rotation.z = -1;
tailMesh.position.set(-0.32, 0.1, 0);
tail.add(tailMesh);
robot.add(tail);

function leg(x, z) {
  const root = new THREE.Group();
  root.position.set(x, -0.15, z);
  root.add(box(0.24, 0.18, 0.24, dark));
  const upper = new THREE.Group();
  upper.position.y = -0.12;
  upper.add(box(0.17, 0.62, 0.17, metal, 0, -0.31, 0));
  const lower = new THREE.Group();
  lower.position.y = -0.64;
  lower.add(box(0.15, 0.55, 0.15, metal, 0, -0.28, 0));
  lower.add(box(0.32, 0.1, 0.22, dark, 0.05, -0.58, 0));
  upper.add(lower);
  root.add(upper);
  robot.add(root);
  return { upper, lower };
}

const legs = [leg(0.82, 0.43), leg(0.82, -0.43), leg(-0.82, 0.43), leg(-0.82, -0.43)];

let dragging = false, px = 0, py = 0, yaw = robot.rotation.y, pitch = 0.05;
addEventListener('pointerdown', e => { dragging = true; px = e.clientX; py = e.clientY; });
addEventListener('pointerup', () => dragging = false);
addEventListener('pointermove', e => {
  if (!dragging) return;
  yaw += (e.clientX - px) * 0.01;
  pitch += (e.clientY - py) * 0.005;
  pitch = Math.max(-0.35, Math.min(0.35, pitch));
  px = e.clientX; py = e.clientY;
});
addEventListener('wheel', e => { camera.position.z = Math.min(10, Math.max(3.5, camera.position.z + e.deltaY * 0.003)); }, { passive: true });
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const a = Math.sin(t * 3.3) * 0.45;
  const b = -a;
  legs[0].upper.rotation.z = a; legs[0].lower.rotation.z = -a * 0.7;
  legs[3].upper.rotation.z = a; legs[3].lower.rotation.z = -a * 0.7;
  legs[1].upper.rotation.z = b; legs[1].lower.rotation.z = -b * 0.7;
  legs[2].upper.rotation.z = b; legs[2].lower.rotation.z = -b * 0.7;
  robot.position.y = 0.06 + Math.abs(Math.sin(t * 3.3)) * 0.07;
  robot.rotation.y += (yaw - robot.rotation.y) * 0.08;
  robot.rotation.x += (pitch - robot.rotation.x) * 0.08;
  head.rotation.z = Math.sin(t * 2.4) * 0.04;
  tail.rotation.z = Math.sin(t * 5) * 0.25;
  renderer.render(scene, camera);
}
animate();

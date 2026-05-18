import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

const app = document.querySelector('#app');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 6);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(renderer.domElement);

// Stage 1: basic environment light
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// Stage 2: floor and walls
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(8,8),
  new THREE.MeshStandardMaterial({color:0xcccccc})
);
floor.rotation.x = -Math.PI/2;
floor.position.y = 0;
scene.add(floor);

const wallMat = new THREE.MeshStandardMaterial({color:0xffffff});
const backWall = new THREE.Mesh(new THREE.PlaneGeometry(8,4), wallMat);
backWall.position.set(0,2,-4);
scene.add(backWall);
const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(8,4), wallMat);
leftWall.rotation.y = Math.PI/2;
leftWall.position.set(-4,2,0);
scene.add(leftWall);

// Stage 3: simple furniture
const sofa = new THREE.Mesh(new THREE.BoxGeometry(2,0.7,1), new THREE.MeshStandardMaterial({color:0x8B4513}));
sofa.position.set(0,0.35,-2);
scene.add(sofa);

const table = new THREE.Mesh(new THREE.BoxGeometry(1,0.4,0.5), new THREE.MeshStandardMaterial({color:0x555555}));
table.position.set(0,0.2,0);
scene.add(table);

// Stage 4: interaction controls
let isDragging=false, prevX=0, prevY=0, yaw=0, pitch=0;
window.addEventListener('pointerdown', e=>{isDragging=true; prevX=e.clientX; prevY=e.clientY;});
window.addEventListener('pointerup', ()=>{isDragging=false;});
window.addEventListener('pointermove', e=>{
  if(!isDragging) return;
  const dx=e.clientX-prevX, dy=e.clientY-prevY;
  yaw += dx*0.01; pitch += dy*0.01;
  prevX=e.clientX; prevY=e.clientY;
});
window.addEventListener('wheel', e=>{camera.position.z=Math.min(10,Math.max(3,camera.position.z+e.deltaY*0.01));});
window.addEventListener('resize', ()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);});

function animate(){
  requestAnimationFrame(animate);
  camera.position.x = Math.sin(yaw)*6;
  camera.position.z = Math.cos(yaw)*6;
  camera.lookAt(0,1,0);
  renderer.render(scene,camera);
}
animate();
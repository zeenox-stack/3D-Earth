import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

const earthMap = {
  normal: loader.load("public/assets/earthMap.jpg"), 
  lights: loader.load("public/assets/earthlights4k.jpg"), 
  clouds: loader.load("public/assets/earthcloudmap.jpg"),
};

const earthGeo = new THREE.IcosahedronGeometry(1, 12);
const earthMat = new THREE.MeshStandardMaterial({
  map: earthMap.normal,
});

const earthGroup = new THREE.Group(); 
const earth = new THREE.Mesh(earthGeo, earthMat);
earth.receiveShadow = true;

earthGroup.rotation.z = -23.4 * Math.PI / 180;

scene.add(earthGroup);
earthGroup.add(earth);

const sunLight = new THREE.DirectionalLight(0xffffff); 
scene.add(sunLight); 

const lightsMat = new THREE.MeshBasicMaterial({
  map: earthMap.lights, 
  blending: THREE.AdditiveBlending, 
  transparency: true,
  opacity: 0.6,
});
const lights = new THREE.Mesh(earthGeo, lightsMat);
lights.scale.set(1.01, 1.01, 1.01);

earthGroup.add(lights);

const cloudMat = new THREE.MeshStandardMaterial({
  map: earthMap.clouds, 
  blending: THREE.AdditiveBlending, 
  transparent: true, 
  opacity: 0.3,
});
const clouds = new THREE.Mesh(earthGeo, cloudMat); 
clouds.scale.set(1.03, 1.03, 1.03);
clouds.castShadow = true;

earthGroup.add(clouds);

sunLight.position.set(-2, -0.5, 1);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const animate = () => {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.002;
  lights.rotation.y += 0.002;
  clouds.rotation.y += 0.0023;

  controls.update();
  renderer.render(scene, camera);
};

window.addEventListener("resize", () => {
  const updatedW = window.innerWidth;
  const updatedH = window.innerHeight;

  camera.aspect = updatedW / updatedH;
  camera.updateProjectionMatrix();

  renderer.setSize(updatedW, updatedH);
});

animate();

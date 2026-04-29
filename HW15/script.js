import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5e9e6);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(4, 3, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4; // brighter like original
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//
// 
//

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x666666, 2.5);
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 8, 5);
scene.add(directionalLight);

const warmLight = new THREE.PointLight(0xffcc99, 4, 20);
warmLight.position.set(-3, 3, 4);
scene.add(warmLight);

//
//
//

let sun = null;
let clouds = [];
let cloudBasePositions = [];

const loader = new GLTFLoader();

loader.load("models/scene.glb", function (gltf) {
  const model = gltf.scene;
  scene.add(model);

  model.traverse(function (child) {
    console.log("object name:", child.name);

    if (child.name.toLowerCase().includes("sun")) {
      sun = child;
    }

    if (child.name.toLowerCase().includes("cloud")) {
      clouds.push(child);
      cloudBasePositions.push(child.position.y);
    }

    if (child.isMesh && child.material) {
      child.material.needsUpdate = true;
    }
  });
});

//
// 
//

let time = 0;

function animate() {
  requestAnimationFrame(animate);

  time += 0.02;

  if (sun) {
    sun.rotation.y += 0.01;
    sun.rotation.x += 0.005;
  }

  clouds.forEach(function (cloud, index) {
    cloud.position.y =
      cloudBasePositions[index] + Math.sin(time + index * 1.4) * 0.15;
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();

//
//
//

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

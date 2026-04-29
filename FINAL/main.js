
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer, controls;
let bedroom;

let laptopScreen = null;
let cloudObjects = [];
let cloudStartPositions = [];

let raycaster;
let mouse;

let ambientLight;
let mainLight;
let blueLight;
let pinkLight;
let warmLight;
let overheadLight;

let backgroundSound;

let nightMode = true;
let laptopOn = false;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1f3d);

  camera = new THREE.PerspectiveCamera(
    38,
    window.innerWidth / window.innerHeight,
    5,
    200
  );

  camera.position.set(-1, 12, 34);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 1, 0);
  controls.minDistance = 12;
  controls.maxDistance = 50;
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.maxPolarAngle = Math.PI / 2;
  controls.update();

  ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  mainLight = new THREE.DirectionalLight(0xffffff, 0.4);
  mainLight.position.set(4, 6, 6);
  scene.add(mainLight);

  blueLight = new THREE.PointLight(0xbdefff, 2.5, 20);
  blueLight.position.set(0, 4, 4);
  scene.add(blueLight);

  pinkLight = new THREE.PointLight(0xffc8f0, 0.6, 16);
  pinkLight.position.set(-3, 3, 3);
  scene.add(pinkLight);

  warmLight = new THREE.PointLight(0xffe0b8, 0.2, 20);
  warmLight.position.set(-4, 5, 6);
  scene.add(warmLight);

  overheadLight = new THREE.DirectionalLight(0xffe6d8, 0.0);
  overheadLight.position.set(0, 12, 0);
  scene.add(overheadLight);

  backgroundSound = new Audio("assets/sleep.mp3");
  backgroundSound.loop = true;
  backgroundSound.volume = 0.35;

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  const loader = new GLTFLoader();

  loader.load(
    "assets/bedroom.glb",
    function (gltf) {
      bedroom = gltf.scene;
      scene.add(bedroom);

      bedroom.position.set(0, 0, 0);
      bedroom.scale.set(1, 1, 1);
      bedroom.rotation.y = Math.PI;

      bedroom.traverse(function (child) {
        if (child.isMesh) {
          let name = child.name.toLowerCase();
          let parentName = child.parent ? child.parent.name.toLowerCase() : "";

          if (name.includes("screen")) {
            laptopScreen = child;
            laptopScreen.material = laptopScreen.material.clone();
          }

          if (name.includes("cloud") || parentName.includes("cloud")) {
            child.material = child.material.clone();
            cloudObjects.push(child);
            cloudStartPositions.push(child.position.clone());
          }
        }
      });

      setNightMode();
    }
  );

  window.addEventListener("resize", onWindowResize);
  window.addEventListener("click", onClick);
  window.addEventListener("pointerdown", startBackgroundSound, { once: true });
}

function startBackgroundSound() {
  backgroundSound.play().catch(() => {});
}

function onClick(event) {
  if (!bedroom) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObjects(bedroom.children, true);

  if (hits.length > 0) {
    const clicked = hits[0].object;

    if (clicked.name.toLowerCase().includes("screen")) {
      laptopOn = !laptopOn;

      if (laptopOn) {
        laptopScreen.material.emissive = new THREE.Color(0x66fff2);
        laptopScreen.material.emissiveIntensity = 2.2;
      } else {
        laptopScreen.material.emissive = new THREE.Color(0x000000);
        laptopScreen.material.emissiveIntensity = 0;
      }
    } else if (clicked.name.toLowerCase().includes("bed")) {
      nightMode = !nightMode;

      if (nightMode) {
        setNightMode();
      } else {
        setDayMode();
      }
    }
  }
}

function setNightMode() {
  scene.background = new THREE.Color(0x1a1f3d);

  ambientLight.intensity = 0.7;
  mainLight.intensity = 0.4;
  blueLight.intensity = 2.8;
  pinkLight.intensity = 0.6;
  warmLight.intensity = 0.05;
  overheadLight.intensity = 0;

  for (let i = 0; i < cloudObjects.length; i++) {
  cloudObjects[i].material.emissive = new THREE.Color(0xbfd8ff);
cloudObjects[i].material.emissiveIntensity = 0.25;
  }
}

function setDayMode() {
  scene.background = new THREE.Color(0xf3e7f2); // slightly pink sky

  ambientLight.intensity = 1.4;
  mainLight.intensity = 0.8;
  blueLight.intensity = 0.3;
  pinkLight.intensity = 0.5;
  warmLight.intensity = 1.2;
  overheadLight.intensity = 0.9;

  for (let i = 0; i < cloudObjects.length; i++) {
    cloudObjects[i].material.emissive = new THREE.Color(0xfff0f5);
    cloudObjects[i].material.emissiveIntensity = 0.3;
  }
}

function animateClouds() {
  for (let i = 0; i < cloudObjects.length; i++) {
    let start = cloudStartPositions[i];

    let bob = Math.sin(Date.now() * 0.0012 + i) * 0.08;

    cloudObjects[i].position.y = start.y + bob;
  }
}

function animate() {
  requestAnimationFrame(animate);

  animateClouds();

  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

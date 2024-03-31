// 011 Texture

"use strict";
// Importing
import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// Dome Elm
const canvas = document.querySelector("canvas.webgl");
// Textures with js

// const image = new Image();
// const texture = new THREE.Texture(image);
// image.addEventListener("load", () => {
//   texture.needsUpdate = true;
// });
// image.src = "/textures/Door_Wood_001_basecolor.jpg";
const loadingManager = new THREE.LoadingManager();

/*
loadingManager.onStart = () => console.log("start");

loadingManager.onProgress = () => console.log("Progress");

loadingManager.onLoad = () => console.log("loade");

loadingManager.onError = () => console.log("error");
*/
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load("/textures/black-white.jpg");
const alphaTexture = textureLoader.load("/textures/alpha.jpg");
const normalTexture = textureLoader.load("/textures/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/ambientOcclusion.jpg"
);
const metallicTexture = textureLoader.load("/textures/metallic.jpg");

// colorTexture.rotation = Math.PI * 0.25;
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;
// much sharper
// colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;
// Create Scene
const scene = new THREE.Scene();
// Create Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);

console.log(geometry.attributes.uv);

const material = new THREE.MeshBasicMaterial({
  map: colorTexture,
});
const mesh = new THREE.Mesh(geometry, material);

// Poitions
mesh.position.y = 0;
mesh.position.x = 0;
mesh.position.z = 1;
// Add mesh to scene
scene.add(mesh);

// Create Renderer size:
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// handel resize
window.addEventListener("resize", () => {
  //   Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  // works when you change screen
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

scene.add(camera);
// Create Renderer:
const renderer = new THREE.WebGL1Renderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Position Camera without mouse
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 10;

//? Clock
const clock = new THREE.Clock();

// Animations

const tick = () => {
  // ? Clock
  const elapsedTime = clock.getElapsedTime();
  camera.lookAt(mesh.position);

  // ? Update controls
  controls.update();
  //? Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

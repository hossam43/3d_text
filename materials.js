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

//! Texture
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader();
// load door
const doorColorTexture = textureLoader.load("/textures/door/door.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAOTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg");
const doorHeightTexture = textureLoader.load("/textures/door/height.png");
const metalness = textureLoader.load("/textures/door/metalness.jpg");
const roughness = textureLoader.load("/textures/door/roughness.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");

doorColorTexture.magFilter = THREE.NearestFilter;
const gradeintTexture = textureLoader.load("/textures/gradient/gray.jpg");
const matcapTexture = textureLoader.load("/textures/matcap/matcap-3.png");
const matcapTexture1 = textureLoader.load("/textures/matcap/matcap-4.png");
// Env
const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/1/px.jpg",
  "/textures/environmentMaps/1/nx.jpg",
  "/textures/environmentMaps/1/py.jpg",
  "/textures/environmentMaps/1/ny.jpg",
  "/textures/environmentMaps/1/pz.jpg",
  "/textures/environmentMaps/1/nz.jpg",
]);

// add Debug
const gui = new dat.GUI();

// Create Scene
const scene = new THREE.Scene();
// Create Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);

console.log(geometry.attributes.uv);

//? MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial();
// material.color.set("yellow");
// material.map = doorColorTexture;
// material.color = new THREE.Color("#ff00ff");
// material.wireframe = true;
// material.opacity = 0.5;
// material.transparent = true;
// material.side = THREE.DoubleSide;
// material.map = matcapTexture;

//? MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial();
// material.wireframe = true;
// material.flatShading = true;

//? MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture1;

// ? MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial();

//? MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial();

//? MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 1000;
// material.specular = new THREE.Color("red"); //a red light reflection
// ? MeshToonMaterial
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradeintTexture;

//? MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0.45;
// material.roughness = 0.45;
// material.map = doorColorTexture;
// // without it it look falt
// material.aoMap = doorAOTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.15;
// material.metalnessMap = metalness;
// material.roughnessMap = roughness;
// material.normalMap = doorNormalTexture;
// material.alphaMap = doorAlphaTexture;
// material.transparent = true;

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environmentMapTexture;

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "aoMapIntensity").min(0).max(10).step(0.0001);
// displacements
gui.add(material, "displacementScale").min(0).max(1).step(0.0001);

const textureFolder = gui.addFolder("Texture Settings");

const metalnessMapSettings = {
  intensity: 1,
  min: 0,
  max: 10,
};

textureFolder
  .add(metalnessMapSettings, "intensity")
  .min(0)
  .max(10)
  .step(0.01)
  .onChange(() => {
    material.metalnessMapIntensity = metalnessMapSettings.intensity;
  });

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5, 100, 100), material);

plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);

// Poitions
sphere.position.y = 0;
sphere.position.x = -5;
sphere.position.z = 5;
torus.position.x = 5;

// Add mesh to scene
scene.add(sphere, plane, torus);

// Create Renderer size:
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Adding some light
const ambientLight = new THREE.AmbientLight(0xffffffff, 3);
const pointLight = new THREE.PointLight(0xfff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(ambientLight);
scene.add(pointLight);

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
  //   update objects
  plane.rotation.y = 0.1 * elapsedTime;
  // plane.rotation.x = 0.1 * elapsedTime;

  torus.rotation.y = 0.4 * elapsedTime;

  camera.lookAt(sphere.position);

  // ? Update controls
  controls.update();
  //? Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

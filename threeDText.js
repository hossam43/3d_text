// 011 Texture

"use strict";
// Importing
import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Dome Elm
const canvas = document.querySelector("canvas.webgl");

// Texture
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("textures/matcap/matcap-8.png");

// Loading Fonts
const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("LOOK BEHIND YOU", {
    font,
    size: 1,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
    bevelSize: 0.02,
  });

  //   textGeometry.computeBoundingBox();
  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  //   );
  // ? to center it
  textGeometry.center();

  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

  for (let i = 0; i < 300; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    // random rotation
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    // random size
    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
    scene.add(donut);
  }
  console.timeEnd("donuts");
});

// add Debug
const gui = new dat.GUI();

// Create Scene
const scene = new THREE.Scene();

// Axes helper
// const axes = new THREE.AxesHelper();
// scene.add(axes);

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;

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

gui.close();

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
  //   plane.rotation.y = 0.1 * elapsedTime;

  //   camera.lookAt(sphere.position);

  // ? Update controls
  controls.update();
  //? Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

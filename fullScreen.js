"use strict";
// Importing
import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

console.log(OrbitControls);

// Dome Elm
const canvas = document.querySelector("canvas.webgl");

// Create Scene
const scene = new THREE.Scene();

// Create Mesh
// const geometry = new THREE.BoxGeometry(1, 1, 1);

const geometry = new THREE.BufferGeometry();

// Define vertices array
const vertices = [
  0,
  0,
  0, // vertex 1
  0,
  1,
  0, // vertex 2
  1,
  0,
  0, // vertex 3
];

// Define indices for the vertices
const indices = [
  0,
  1,
  2, // indices for one triangle (indexes of the vertices)
];

// Add vertices as buffer attributes
geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(vertices, 3)
);

// Add indices for the geometry
geometry.setIndex(indices);

const material = new THREE.MeshBasicMaterial({
  color: "red",
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);

// Poitions
mesh.position.y = 0;
mesh.position.x = 0;
mesh.position.z = 1;

// Scale
mesh.scale.x = 2;
mesh.scale.z = 2;
mesh.scale.y = 2;
// Rotation
mesh.rotation.x = 0; //wheel motion
mesh.rotation.y = 0; //turnado motion

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

window.addEventListener("dblclick", () => {
  console.log(document.fullscreenElement);
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
    console.log("go fullscreen");
  } else {
    document.exitFullscreen();

    console.log("leave fullscreen");
  }
});

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

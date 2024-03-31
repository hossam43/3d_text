// 08	Geometries	preview	35mn
// 09	Debug UI

"use strict";
// Importing
import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

console.log(OrbitControls);
// Dome Elm
const canvas = document.querySelector("canvas.webgl");
const params = {
  color: 0xff0000, // Initial color as an object
  spin: () => {
    console.log("spin");
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 });
  },
};

// Create Scene
const scene = new THREE.Scene();
// Create Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);

// ! more than one trinageles 1
//first way
// const geometry = new THREE.BufferGeometry();

// const positionsArray = new Float32Array(9);
// // 1D array
// positionsArray[0] = 0; //x
// positionsArray[1] = 0; //y
// positionsArray[3] = 0; //z

// positionsArray[3] = 0;
// positionsArray[4] = 1;
// positionsArray[5] = 0;

// positionsArray[6] = 1;
// positionsArray[7] = 0;
// positionsArray[8] = 0;

// second way
// const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);

// const positionAttribute = new THREE.BufferAttribute(positionsArray, 3);

// // name for the attributes
// geometry.setAttribute("position", positionAttribute);

// ! more than one trinageles 2
/*
// const counts = 50;
// const positionsArray = new Float32Array(counts * 3 * 3);

// for (let i = 0; i < counts * 3 * 3; i++) {
//   positionsArray[i] = (Math.random() - 0.5) * 4;
// }
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

// geometry.setAttribute("position", positionsAttribute);

// const vertices = [];
// const indices = [];

// for (let i = 0; i < 100; i++) {
//   for (let j = 0; j < 3; j++) {
//     vertices.push(
//       (Math.random() - 0.5) * 4,
//       (Math.random() - 0.5) * 4,
//       (Math.random() - 0.5) * 4
//     );
//   }
//   const vertexIndex = i * 3;
//   console.log(vertexIndex, vertexIndex + 1, vertexIndex + 2);
//   indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2);
// }

// Define vertices array
// const vertices = [
//   0,
//   0,
//   0, // vertex 1
//   0,
//   1,
//   0, // vertex 2
//   1,
//   0,
//   0, // vertex 3
// ];

// Define indices for the vertices
// the order in which vertices should be connected = faces
// const indices = [0, 1, 2];

// Add vertices as buffer attributes
// it is for position not color
// geometry.setAttribute(
//   "position",
//   new THREE.Float32BufferAttribute(vertices, 3)
// );

// // Add indices for the geometry
// geometry.setIndex(indices);
*/
// ! end of the more the one trinagle

const material = new THREE.MeshBasicMaterial({
  color: params.color,
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

// Full screen
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

// add the dat.GUI
const gui = new dat.GUI();

// gui.add(mesh.position, "y", -3, 3, 0.01);

gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
console.log(dat);

gui.add(mesh, "visible");
// you also can do mesh.material
gui.add(material, "wireframe");

gui
  .addColor(params, "color")
  .name("Model Color")
  .onChange(() => {
    material.color.setHex(params.color); // Set color of the mesh
  });

gui.add(params, "spin");
// gui.hide();

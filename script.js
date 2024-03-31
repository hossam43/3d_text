"use strict";
// Importing
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

console.log(OrbitControls);

// Dome Elm
const canvas = document.querySelector("canvas.webgl");

// Cursor
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);

  // console.log(cursor.x, cursor.y);
});

// ! Render a 3D Cube

// Create Scene
const scene = new THREE.Scene();

// Create Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: "red",
});
const mesh = new THREE.Mesh(geometry, material);

// ! Create Group
const group = new THREE.Group();
// scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "#643" })
);
cube1.position.x = 4;
cube1.position.z = 2;
cube1.scale.x = 2;
cube1.scale.y = 2;

// add it to the group
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "#643" })
);
cube2.position.x = -4;
cube2.position.z = 2;
cube2.scale.x = 2;
cube2.scale.y = 2;
// add it to the group
group.add(cube2);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "#634" })
);
cube3.position.y = -2;
cube3.position.z = 1.5;
cube3.scale.x = 2;
cube3.scale.y = 4;
// add it to the group
group.add(cube3);

// The House mesh
// Poitions
mesh.position.y = 0;
mesh.position.x = 0;
mesh.position.z = 1;
// Add mesh to scene
scene.add(mesh);

// console.log(mesh.position.length());

// Scale
mesh.scale.x = 2;
mesh.scale.z = 2;
mesh.scale.y = 2;
// Rotation
mesh.rotation.x = 0; //wheel motion
mesh.rotation.y = 0; //turnado motion
// mesh.rotation.z = 0; //circle rotation clock motion
// half rotation = PI

// Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// Create Renderer size:
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);

// const aspectRation = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRation,
//   1 * aspectRation,
//   1,
//   -1,
//   0.1,
//   100
// );

// Controls
const controls = new OrbitControls(camera, canvas);
// add Damping
controls.enableDamping = true;

// have a plane view of your object
// controls.target.y = 1;
// controls.update();

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

// console.log(mesh.position.distanceTo(camera.position));
// console.log(mesh.position.normalize()); //from x = 8 to be 1

// ? Time
let time = Date.now();

//? Clock
const clock = new THREE.Clock();

// ? GSAP
// gsap.to(mesh.position, {
//   x: 20,
//   duration: 2,
//   delay: 1,
// });

// gsap.to(group.position, {
//   x: 20,
//   duration: 2,
//   delay: 1,
// });

// gsap.to(mesh.position, {
//   x: 0,
//   duration: 2,
//   delay: 2,
// });

// gsap.to(group.position, {
//   x: 0,
//   duration: 2,
//   delay: 2,
// });

// Animations

const tick = () => {
  // ? Clock
  const elapsedTime = clock.getElapsedTime();

  //? Update camera with cursor position
  // camera.position.x = Math.sin(cursor.x * (Math.PI * 2)) * 3;
  // camera.position.z = Math.cos(cursor.x * (Math.PI * 2)) * 3;
  // camera.position.y = Math.cos(cursor.y * 3);

  // ?
  // camera.position.x = cursor.x * 10;
  // camera.position.y = cursor.y * 10;
  // camera.lookAt(new THREE.Vector3());
  // smae
  camera.lookAt(mesh.position);

  // Time
  // const CurrentTime = Date.now();
  // const deltaTime = CurrentTime - time;
  // time = CurrentTime;
  // console.log(deltaTime);

  // Updatet objects
  // mesh.rotation.y += 0.001 * deltaTime;
  // group.rotation.y += 0.001 * deltaTime;

  // ? Regular to rotation with elapsed
  // mesh.rotation.y = elapsedTime;
  // group.rotation.y = elapsedTime;

  //? one complete rotation by second
  // group.rotation.y = elapsedTime * Math.PI * 2;

  // mesh.rotation.y = elapsedTime * Math.PI * 2;

  //? move in the sin way

  // group.position.y = Math.sin(elapsedTime);

  // mesh.position.y = Math.sin(elapsedTime);

  //? make the mesh move in a clock

  // group.position.y = Math.sin(elapsedTime);

  // group.position.x = Math.cos(elapsedTime);

  // mesh.position.y = Math.sin(elapsedTime);

  // mesh.position.x = Math.cos(elapsedTime);

  // ? Make the camera animation

  // camera.position.y = Math.sin(elapsedTime);

  // camera.position.x = Math.cos(elapsedTime);

  // camera.lookAt(mesh.position);

  // ? Update controls
  controls.update();

  //? Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

// Add GSAP to the dependencie to the node module

// ! Camera Lesson

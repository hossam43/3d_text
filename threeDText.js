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
const matcapTexture2 = textureLoader.load("textures/matcap/matcap-9.png");

// Define text variable outside of the font loader callback
let text;

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

  text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const boxGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);

  for (let i = 0; i < 220; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    const cube = new THREE.Mesh(boxGeometry, material);
    const sphere = new THREE.Mesh(sphereGeometry, material);

    donut.position.x = (Math.random() - 0.5) * 20;
    donut.position.y = (Math.random() - 0.5) * 20;
    donut.position.z = (Math.random() - 0.5) * 20;

    cube.position.x = (Math.random() - 0.5) * 20;
    cube.position.y = (Math.random() - 0.5) * 20;
    cube.position.z = (Math.random() - 0.5) * 20;

    sphere.position.x = (Math.random() - 0.5) * 40;
    sphere.position.y = (Math.random() - 0.5) * 40;
    sphere.position.z = (Math.random() - 0.5) * 40;

    // random rotation
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;
    cube.rotation.x = Math.random() * Math.PI;
    cube.rotation.y = Math.random() * Math.PI;

    // random size
    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
    cube.scale.set(scale, scale, scale);
    sphere.scale.set(scale, scale, scale);

    scene.add(donut, cube, sphere);
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

const tick = () => {
  // Clock
  const elapsedTime = clock.getElapsedTime();

  // Update rotations of the objects in the scene
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child !== text) {
      // Exclude text geometry
      child.rotation.x += 0.01; // Rotate around x-axis
      child.rotation.y += 0.01; // Rotate around y-axis
      // Add more rotation if needed
    }
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Request the next frame
  window.requestAnimationFrame(tick);
};

tick();

//  sound icon

const soundIcon = document.getElementById("soundIcon");
const audio = new Audio("./sound2.mp3");
audio.volume = 0.4;
let isMuted = true;

soundIcon.addEventListener("click", () => {
  isMuted = !isMuted;
  if (isMuted) {
    audio.pause();
    soundIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="8px" viewBox="0 0 10 8" version="1.1">
        <g id="Audio" transform="translate(0.000000, 0.500000)" stroke="currentColor" stroke-width="1" fill-rule="evenodd" stroke-linecap="round">
        <line x1="8.5" y1="0.493135" x2="8.5" y2="6.50687" id="Line-5"/>
		
    
		<line x1="6.5" y1="0.789016" x2="6.5" y2="6.21098" id="Line-4"/>
		
    
		<line x1="4.5" y1="1.67582" x2="4.5" y2="5.32418" id="Line-3"/>
		
    
		<line x1="2.5" y1="1.14678" x2="2.5" y2="5.85322" id="Line-2"/>
		
    
		<line x1="0.5" y1="1.67582" x2="0.5" y2="5.32418" id="Line-1"/>
		
          <line x1="0" y1="8" x2="10" y2="0" stroke="currentColor" stroke-width="1"/>
        </g>
      </svg>
    `;
  } else {
    audio.play();
    soundIcon.innerHTML = `
      <svg width="10px" height="8px" viewBox="0 0 10 8" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g id="Audio" transform="translate(0.000000, 0.500000)" stroke="currentColor" stroke-width="1" fill-rule="evenodd" stroke-linecap="round">
          <line x1="8.5" y1="0.493135" x2="8.5" y2="6.50687" id="Line-5">
            <animate attributeType="XML" attributeName="y1" values="2;0;2" keyTimes="0;0.5;1" dur=".8s" repeatCount="indefinite"></animate>
            <animate attributeType="XML" attributeName="y2" values="5;7;5" keyTimes="0;0.5;1" dur=".8s" repeatCount="indefinite"></animate>
          </line>
          <line x1="6.5" y1="0.789016" x2="6.5" y2="6.21098" id="Line-4">
            <animate attributeType="XML" attributeName="y1" values="0;2;0" keyTimes="0;0.5;1" dur=".5s" repeatCount="indefinite"></animate>
            <animate attributeType="XML" attributeName="y2" values="7;5;7" keyTimes="0;0.5;1" dur=".5s" repeatCount="indefinite"></animate>
          </line>
          <line x1="4.5" y1="1.67582" x2="4.5" y2="5.32418" id="Line-3">
            <animate attributeType="XML" attributeName="y1" values="1;3;1" keyTimes="0;0.5;1" dur=".6s" repeatCount="indefinite"></animate>
            <animate attributeType="XML" attributeName="y2" values="6;4;6" keyTimes="0;0.5;1" dur=".6s" repeatCount="indefinite"></animate>
          </line>
          <line x1="2.5" y1="1.14678" x2="2.5" y2="5.85322" id="Line-2">
            <animate attributeType="XML" attributeName="y1" values="2;1;2" keyTimes="0;0.5;1" dur=".7s" repeatCount="indefinite"></animate>
            <animate attributeType="XML" attributeName="y2" values="5;6;5" keyTimes="0;0.5;1" dur=".7s" repeatCount="indefinite"></animate>
          </line>
          <line x1="0.5" y1="1.67582" x2="0.5" y2="5.32418" id="Line-1">
            <animate attributeType="XML" attributeName="y1" values="3;0;3" keyTimes="0;0.5;1" dur=".9s" repeatCount="indefinite"></animate>
            <animate attributeType="XML" attributeName="y2" values="4;7;4" keyTimes="0;0.5;1" dur=".9s" repeatCount="indefinite"></animate>
          </line>
        </g>
      </svg>
    `;
  }
});

// Play audio on page load and loop it
audio.loop = true;

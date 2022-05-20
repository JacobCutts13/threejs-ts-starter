import {
  Scene,
  Mesh,
  MeshStandardMaterial,
  BoxBufferGeometry,
  PlaneBufferGeometry,
  FogExp2,
  PerspectiveCamera,
  WebGLRenderer,
  CanvasTexture,
  ClampToEdgeWrapping,
  Clock,
  Color,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector3,
} from "three";
import { setupCamera } from "./setupCamera";
import { setupHelpers } from "./setupHelpers";
import { setupLights } from "./setupLights";
import { setupOrbitControls } from "./setupOrbitControls";
import { setupRenderer } from "./setupRenderer";

import * as THREE from "three";

import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise";

let container;
//@ts-ignore
let camera: PerspectiveCamera,
  controls: FirstPersonControls,
  scene: Scene,
  renderer: WebGLRenderer;
let mesh, texture;

const worldWidth = 512,
  worldDepth = 512;
const clock = new Clock();

init();
animate();

function init() {
  container = document.getElementById("container")!;

  camera = new PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    10000,
  );

  scene = new Scene();
  setupLights(scene);
  scene.background = new Color(0x000000);
  scene.fog = new FogExp2(0xadb8c5, 0.0005);

  const data = generateHeight(worldWidth, worldDepth);

  camera.position.set(100, 800, -800);
  camera.lookAt(-100, 810, -800);

  const geometry = new PlaneGeometry(
    7500,
    7500,
    worldWidth - 1,
    worldDepth - 1,
  );
  geometry.rotateX(-Math.PI / 2);

  const vertices = geometry.attributes.position.array;

  for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    //@ts-ignore
    vertices[j + 1] = data[i] * 10;
  }

  texture = new CanvasTexture(generateTexture(data, worldWidth, worldDepth));
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;

  mesh = new Mesh(
    geometry,
    new MeshStandardMaterial({ flatShading: true, color: 0x003f64 }),
  ); //map: texture
  scene.add(mesh);

  renderer = new WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  controls = new FirstPersonControls(camera, renderer.domElement);
  controls.movementSpeed = 150;
  controls.lookSpeed = 0.1;

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  controls.handleResize();
}

function generateHeight(width: number, height: number) {
  let seed = Math.PI / 4;
  window.Math.random = function () {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const size = width * height,
    data = new Uint8Array(size);
  const perlin = new ImprovedNoise(),
    z = Math.random() * 100;

  let noiseScale = 1;

  for (let octaveLayer = 0; octaveLayer < 4; octaveLayer++) {
    for (let i = 0; i < size; i++) {
      const x = i % width,
        y = ~~(i / width);
      data[i] += Math.abs(
        perlin.noise(x / noiseScale, y / noiseScale, z) * noiseScale * 1.75,
      );
    }

    noiseScale *= 5;
  }

  return data;
}

function generateTexture(data: Uint8Array, width: number, height: number) {
  let context, image, imageData, shade;

  const vector3 = new Vector3(0, 0, 0);

  const sun = new Vector3(1, 1, 1);
  sun.normalize();

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  context = canvas.getContext("2d")!;
  context.fillStyle = "#000";
  context.fillRect(0, 0, width, height);

  image = context.getImageData(0, 0, canvas.width, canvas.height);
  imageData = image.data;

  for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
    vector3.x = data[j - 2] - data[j + 2];
    vector3.y = 2;
    vector3.z = data[j - width * 2] - data[j + width * 2];
    vector3.normalize();

    shade = vector3.dot(sun);

    imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
    imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
    imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
  }

  context.putImageData(image, 0, 0);

  // Scaled 4x

  const canvasScaled = document.createElement("canvas");
  canvasScaled.width = width * 4;
  canvasScaled.height = height * 4;

  context = canvasScaled.getContext("2d")!;
  context.scale(4, 4);
  context.drawImage(canvas, 0, 0);

  image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
  imageData = image.data;

  for (let i = 0, l = imageData.length; i < l; i += 4) {
    const v = ~~(Math.random() * 5);

    imageData[i] += v;
    imageData[i + 1] += v;
    imageData[i + 2] += v;
  }

  context.putImageData(image, 0, 0);

  return canvasScaled;
}

//

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  controls.update(clock.getDelta());
  renderer.render(scene, camera);
}

import * as THREE from "three"
import { ThreeJSOverlayView } from "@googlemaps/three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { drawBPs } from "./drawbp";
import { configureControls } from "./controls";

let map: google.maps.Map;

const mapOptions = {
  tilt: 60,
  heading: 0,
  zoom: 19,
  center: { lat: 49.672318, lng: 7.988749 },
  //mapId: "15431d2b469f209e",
  //mapId: "7a965f70695bc017",
  mapId: "8e0a97af9386fef",
  
  // disable interactions due to animation loop and moveCamera
  disableDefaultUI: true,
  //gestureHandling: "none",
  keyboardShortcuts: true,
};

function initMap(): void {
  const mapDiv = document.getElementById("map") as HTMLElement;
  map = new google.maps.Map(mapDiv, mapOptions);

  drawBPs(map);
  configureControls(map);
  //drawWebGL(map);

}

function drawWebGL(map){

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  const camera = new THREE.PerspectiveCamera();  

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const skyColor = 0xB1E1FF;  // light blue
  const groundColor = 0xB97A20;  // brownish orange
  const intensity = 2;
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  //scene.add(light);

  const sunPos = [1,10,50];
  const materialSun = new THREE.MeshPhongMaterial({color: 0xFFFF00});
  //const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const sun = new THREE.Mesh(new THREE.SphereGeometry(1), materialSun);
  sun.position.set(sunPos[0], sunPos[1], sunPos[2]);
  scene.add(sun);

  const sunlight = new THREE.DirectionalLight(0xFFFF00, 1.0);
  sunlight.position.set(sunPos[0], sunPos[1], sunPos[2]);
  sunlight.target.position.set(10,6,10);
  sunlight.castShadow = true;
  scene.add(sunlight);
  scene.add(sunlight.target);

  // const sunlight = new THREE.PointLight(0xFFFF00, 1.0);
  // sunlight.position.set(sunPos[0], sunPos[1], sunPos[2]);
  // sunlight.castShadow = true;
  // scene.add(sunlight);

  const materialGrass = new THREE.MeshPhongMaterial({color: 0x33aa44});
  materialGrass.receiveShadow = true;
  const floor = new THREE.Mesh(new THREE.BoxGeometry(400, 0.01, 400), materialGrass);
  floor.position.x = -30;
  floor.position.y = 0;
  floor.position.z = 0;
  scene.add(floor);

  const materialHouse = new THREE.MeshPhongMaterial({color: 0x666666});
  materialHouse.receiveShadow = true;
  materialHouse.flatShading = true;
  materialGrass.castShadow = true;

  const house = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 10), materialHouse);
  
  house.position.x = -13;
  house.position.y = 10;
  house.position.z = 10;
  scene.add(house);

  const house2 = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 10), materialHouse);
  house2.position.x = 10;
  house2.position.y = 10;
  house2.position.z = 10;
  //house2.Rotate
  scene.add(house2);

  const cameraHelper = new THREE.CameraHelper(sunlight.shadow.camera);
  scene.add(cameraHelper);

  let { tilt, heading, zoom } = mapOptions;

    const animate = () => {
      //house.position.z += 1;
      requestAnimationFrame(animate);
    };

  requestAnimationFrame(animate);


  const threeov = new ThreeJSOverlayView({
    map,
    scene,
    anchor: { ...mapOptions.center, altitude: 0 },
    THREE,
  });

  
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};

import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


function main() {
    const canvas = document.querySelector('#c');

    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.shadowMap.enabled = true;

    const fov = 115;
    const aspect = 1;  // the canvas default
    const near = 0.1;
    const far = 300;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(-10, 30, 70);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(-8, 4, 30);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    drawPlane(scene);

    const house1 = constructHouse(8,11,4.5,7);
    house1.position.set(-12,2.25,34.8);
    house1.rotation.y = THREE.MathUtils.degToRad(-20 );
    scene.add(house1);

    const house2 = constructHouse(8,11,4.5,7);
    house2.position.set(-28,2.25,32.3);
    house2.rotation.y = THREE.MathUtils.degToRad(-2);
    scene.add(house2);

    const house3 = constructHouse(8,11,4.5,7);
    house3.position.set(2,2.25,45.3);
    house3.rotation.y = THREE.MathUtils.degToRad(-40);
    scene.add(house3);


    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light)

    const sun = constructSunlight(scene);
    scene.add(sun);
 


    /*
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    //scene.add(ambientLight);

    



    // const sunlight = new THREE.PointLight(0xFFFF00, 1.0);
    // sunlight.position.set(sunPos[0], sunPos[1], sunPos[2]);
    // sunlight.castShadow = true;
    // scene.add(sunlight);

    const materialGrass = new THREE.MeshPhongMaterial({color: 0x33aa44});
    materialGrass.receiveShadow = true;
    const floor = new THREE.Mesh(new THREE.BoxGeometry(20, 1, 20), materialGrass);
    floor.position.x = 0;
    floor.position.y = 0;
    floor.position.z = 0;
    scene.add(floor);

 

 

    


    function render(time) {
        time *= 0.001;  // convert time to seconds

        //camera.position.z -= 1;
        //camera.rotation.z += 10;
        //camera.rotation.y = time;
       
        renderer.render(scene, camera);
       
        requestAnimationFrame(render);
      }

    requestAnimationFrame(render);
    */

    function render() {

      /*if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }*/
  
      renderer.render(scene, camera);
  
      requestAnimationFrame(render);
    }
  
    requestAnimationFrame(render);

    //renderer.render(scene, camera);

}


function constructSunlight(scene){

  const sunPos = [0,50,0];
  const materialSun = new THREE.MeshPhongMaterial({color: 0xFFFF00});
  const sun = new THREE.Mesh(new THREE.SphereGeometry(1), materialSun);
  sun.position.set(sunPos[0], sunPos[1], sunPos[2]);
 
  const radius = 50;  
  const segments = 240;  
  const sunpath = new THREE.CircleGeometry(radius, segments);
  const sunpathmat = new THREE.MeshPhongMaterial({color: 'blue', side: THREE.DoubleSide,});
  const sunpathmesh = new THREE.Mesh(sunpath, sunpathmat);
  
  sunpathmesh.position.x =-10;
  //sunpathmesh.rotation.z = THREE.MathUtils.degToRad(0); 
  //sunpathmesh.rotation.x = THREE.MathUtils.degToRad(45); 
  //sunpathmesh.rotation.y = THREE.MathUtils.degToRad(45); 

  const sunlight = new THREE.SpotLight(0xFFFFFF, 0.3);
  sunlight.position.set(sunPos[0], sunPos[1], sunPos[2]);
  sunlight.castShadow = true;
  scene.add(sunlight);
  //scene.add(sunlight.target);

  const cameraHelper = new THREE.CameraHelper(sunlight.shadow.camera);
  scene.add(cameraHelper);

  const allsun = new THREE.Group();
  allsun.add( sun );
  allsun.add( sunpathmesh );
  allsun.add( sunlight );
  
  return allsun;

}

function drawPlane(scene, hasTexture:boolean = false){
  const planeSize = 170;

  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  let planeMat;

  if (hasTexture == true){
    
    const txtureUrl = 'baugebiet.png'
    const loader = new THREE.TextureLoader();
    const texture = loader.load(txtureUrl);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.magFilter = THREE.LinearFilter;
    //const  = planeSize / 2;
    //texture.repeat.set(repeats, repeats);

    planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
  } else {
    planeMat = new THREE.MeshPhongMaterial({color: '#CCC',side: THREE.DoubleSide,});
  }
  
  const mesh = new THREE.Mesh(planeGeo, planeMat);
  mesh.receiveShadow = true;
  mesh.rotation.x = Math.PI * -.5;
  scene.add(mesh);
}


function constructHouse(w,l,h1,h2){
  const bau = new THREE.BoxGeometry(w, h1, l);
  const cubeMat = new THREE.MeshPhongMaterial({color: '#FFF'});
  const bauMesh = new THREE.Mesh(bau, cubeMat);
  bauMesh.castShadow = true;
  
  const dach = new THREE.BoxGeometry(h2-1, 1, l);
  const dachMat = new THREE.MeshPhongMaterial({color: '#FF3333'});
  const dachMesh = new THREE.Mesh(dach, dachMat);
  dachMesh.position.x = w/2 - 2;
  dachMesh.position.y = h1;
  dachMesh.castShadow = true;
  dachMesh.rotation.z = THREE.MathUtils.degToRad(-45);

  const dach2 = new THREE.BoxGeometry(h2-1, 1, l);
  const dach2Mat = new THREE.MeshPhongMaterial({color: '#FF3333'});
  const dach2Mesh = new THREE.Mesh(dach, dachMat);
  dach2Mesh.position.x = - w/2 + 2;
  dach2Mesh.position.y = h1;
  dach2Mesh.castShadow = true;
  dach2Mesh.rotation.z = THREE.MathUtils.degToRad(45);

  const house = new THREE.Group();
  house.add( bauMesh );
  house.add( dachMesh );
  house.add( dach2Mesh );

  house.castShadow = true;

  return house;

}


  


main()

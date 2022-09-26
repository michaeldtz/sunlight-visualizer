import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import SunCalc from "suncalc"
import GUI from 'lil-gui'; 


class DateKeeper {
  _date: Date;
  _hour: number;
  _min: number;
  _animate: boolean;
  
  constructor(date, hour, min, animate){
    this._date = date;
    this._hour = hour;
    this._min = min;
    this._animate = animate;
  }

  get animate(){
    return this._animate ;
  }
  
  set animate(animate){
    this._animate = animate;
  }

  get date() {
    return this._date
  }
  set date(dateInp) {
    this._date = dateInp;
  }

  get hour() {
    return this._hour
  }
  set hour(hourInp) {
    this._hour = hourInp;
    while(this._hour > 24){
      this._hour -= 24;
    }
  }

  get minute() {
    return this._min
  }
  set minute(minuteInp) {
    this._min = minuteInp;
    while(this._min > 60){
      this.hour += 1;
      this._min -= 60;
    }
  }
  
  public getDate(){
    return new Date(this.date + " " + this.hour + ":" + this.minute + ":00");
  }
}

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

    drawPlane(scene, true);

    const house1 = constructHouse(8,11,4.5,7);
    house1.position.set(0,2.25,0);
    house1.rotation.y = THREE.MathUtils.degToRad(-20 );
    scene.add(house1);

    const house2 = constructHouse(8,11,4.5,7);
    house2.position.set(-16,2.25,-2);
    house2.rotation.y = THREE.MathUtils.degToRad(-2);
    scene.add(house2);

    const house3 = constructHouse(8,11,4.5,7);
    house3.position.set(14,2.25,11);
    house3.rotation.y = THREE.MathUtils.degToRad(-40);
    scene.add(house3);

    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light)

    const sun = constructSunlight(scene);
    sun.rotation.x = Math.PI * 0.5;
    //sun.rotation.z = 0.4;
    scene.add(sun);
  
    const lat = 49.672268;
    const lng = 7.989103;

    
    
    let theDate = new DateKeeper("2022-06-21",14,30,true);
    const gui = new GUI();
    gui.add( theDate, 'date' );  
    gui.add( theDate, 'hour' ); 
    gui.add( theDate, 'minute' ); 
    gui.add( theDate, 'animate' ); 
    

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    function render() {

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      
      if (theDate.animate){
        theDate.minute += 1;

        
        const pos = SunCalc.getPosition(theDate.getDate(),lat, lng)
        console.log(theDate);
        //console.log(pos);
        sun.children[0].rotation.x = -pos.altitude
        //sun.rotation.x = Math.PI * 0.5 - pos.altitude;
        sun.rotation.z = pos.azimuth;
      }

        renderer.render(scene, camera);
      
  
      requestAnimationFrame(render);
    }
  
    requestAnimationFrame(render);

    //renderer.render(scene, camera);

}


function constructSunlight(scene){

  const sunsize = 85;

  const sunPos = [0,sunsize,0];
  const materialSun = new THREE.MeshPhongMaterial({color: 0xCCCC00});
  const sun = new THREE.Mesh(new THREE.SphereGeometry(3), materialSun);
  sun.position.set(sunPos[0], sunPos[1], sunPos[2]);
 
  const radius = sunsize;  
  const segments = 240;  
  const sunpath = new THREE.RingGeometry(sunsize,sunsize-0.5, segments);
  const sunpathmat = new THREE.MeshPhongMaterial({color: 0xFFFF00, side: THREE.DoubleSide,});
  const sunpathmesh = new THREE.Mesh(sunpath, sunpathmat);
  
  
  //sunpathmesh.rotation.z = THREE.MathUtils.degToRad(0); 
  //sunpathmesh.rotation.x = THREE.MathUtils.degToRad(45); 
  //sunpathmesh.rotation.y = THREE.MathUtils.degToRad(45); 

  const sunlight = new THREE.SpotLight(0xFFFFFF, 0.4);
  sunlight.position.set(sunPos[0], sunPos[1], sunPos[2]);
  sunlight.castShadow = true;
  scene.add(sunlight);
  //scene.add(sunlight.target);

  const cameraHelper = new THREE.CameraHelper(sunlight.shadow.camera);
  scene.add(cameraHelper);

  const allsun = new THREE.Group();
  allsun.add( sun );
  //allsun.add( sunpathmesh );
  allsun.add( sunlight );
  
  allsun.rotation.x = -1.1;

  const group = new THREE.Group();
  group.add(allsun);

  group.rotation.z = 1.0;

  //group.position.x = -10;

  return group;

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
    texture.offset.x = -0.07;
    texture.offset.y = -0.20;
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

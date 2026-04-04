import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.getElementById("exhibit");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, sizes.width / sizes.height, 0.1, 1000 );
if(sizes.width <768){
  camera.position.x = -26;
  camera.position.y = 13;
  camera.position.z = 27;
}
else{
  camera.position.x = -19;
  camera.position.y = 10;
  camera.position.z = 11;
}

scene.background = new THREE.Color('rgb(144, 203, 240)');

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});

const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();
const clock = new THREE.Clock();
let mixer;

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("textures/texture.jpg");
texture.flipY = false;

const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)',3);
scene.add(ambientLight);

renderer.setSize( window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio,2);
//document.body.appendChild( renderer.domElement );
const material = new THREE.MeshBasicMaterial({ map: texture });
controls.enablePan = false;

loader.load('/models/Airplane Textured.glb', function ( gltf ) {
  const model = gltf.scene;
  scene.add(model);
  model.traverse((child) => {
    if (child.isMesh) {
      //child.material = material;
      //child.material.needsUpdate = true;
    }
  });
  mixer = new THREE.AnimationMixer(gltf.scene);

    gltf.animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    action.play();
    });
}, undefined, function ( error ) {
  console.error( error );

} );



function getCameraX(){
  return "X: " + camera.position.x.toFixed(2);
}
function getCameraY(){
  return "Y: " + camera.position.y.toFixed(2);
}
function getCameraZ(){
  return "Z: " + camera.position.z.toFixed(2);
}
function animate( time ) {
  renderer.setAnimationLoop((time) => {
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
});
}
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
});
window.addEventListener("click",()=>{
   console.log(getCameraX());
   console.log(getCameraY());
   console.log(getCameraZ());
});
renderer.setAnimationLoop( animate );
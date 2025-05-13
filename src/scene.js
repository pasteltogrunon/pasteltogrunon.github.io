import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { materialTransmission } from 'three/src/nodes/TSL.js';



// Configuración de Three.js
var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
const clock = new THREE.Clock()

var scrollValue = 0;

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

var renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio)
var canvas = renderer.domElement;
renderer.setViewport(0, 0, canvas.width, canvas.height)

document.body.appendChild(canvas);
var scrollValue = 0;

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';

// Definir la geometría del plano
var geometry = new THREE.PlaneBufferGeometry(2, 2);

// Definir los uniformes del shader
var uniforms = {
    iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio) },
    iTime: { value: 0.0 },
    iMouse: { value: new THREE.Vector4() },
    iScroll: { value: 0.0 }
};


async function readFileAsString(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Error reading file:', error);
    }
}

readFileAsString('src/shaders/neon.glsl')
    .then(shaderCode => {
        // Crear el material utilizando el fragment shader
        var material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: shaderCode
        });
        // Crear el plano y aplicar el material
        var plane = new THREE.Mesh(geometry, material);
        scene.add(plane);
    });


// Configuración de la cámara
camera.position.z = 5;

// Función de renderizado
function render() {
  requestAnimationFrame(render);
  uniforms.iTime.value -=  clock.getDelta() *(1.1 - scrollValue)* 0.5; // Actualizar el tiempo para la animación
  renderer.render(scene, camera);
}
// Llamar a la función de renderizado
render();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio || 1);

  // Ajustar el tamaño de la geometría del plano

  // Actualizar la resolución uniforme
  uniforms.iResolution.value.set(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio);
}

window.addEventListener('resize', onWindowResize, false);

// Función para manejar eventos del ratón
function onMouseMove(event) {
  // Normalizar la posición del ratón entre -1 y 1
  var mouseX = (event.clientX);
  var mouseY = -(event.clientY)+window.innerHeight;
  // Actualizar el valor de iMouse
  uniforms.iMouse.value.set(mouseX, mouseY, 0.0, 0.0).multiplyScalar(window.devicePixelRatio);
}

// Agregar un evento de escucha para el movimiento del ratón
document.addEventListener('mousemove', onMouseMove, false);

// Función para manejar el evento de scroll
function onScroll(event) {
    scrollValue = window.scrollY || document.documentElement.scrollTop;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollValue = maxScroll > 0 ? scrollValue / maxScroll : 0; // Remap scrollValue to range [0, 1]
    console.log(scrollValue);

    uniforms.iScroll.value = scrollValue; 
}

// Agregar un evento de escucha para el scroll
window.addEventListener('scroll', onScroll, false);
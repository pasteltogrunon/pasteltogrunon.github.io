import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';

// Cargar el fragment shader
var fragmentShaderCode = `
uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;

vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 0.718, 0.1);
    vec3 d = vec3(0.984,0.522,0.0);

    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / max(iResolution.x, iResolution.y);
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);

    for (float i = 0.0; i < 4.0; i++) {
        uv = fract(pow(uv, vec2(2.0)) * 2.0) - 0.5;
        float d = length(uv) * exp(-length(uv0));
        vec3 col = palette(length(uv0) + i * 0.4 + iTime * 0.4);
        d = sin(d * 3.0 + iTime) / 8.0;
        d = abs(d);
        d = pow(0.01 / d, 1.5);
        finalColor += col * d;
    }

    float d = length(iMouse.xy - gl_FragCoord.xy) / max(iResolution.x, iResolution.y);;
    float v = abs(sin(d * 50.0 - iTime * 5.0));
    v = clamp(1.5 / v, 0.0, 10.0)*exp(-25.0*d);
    v = pow(v, 5.0);
    finalColor = clamp(pow(finalColor, vec3(1.1)), 0.0, 5.0) * (1.0 + v);

    gl_FragColor = vec4(finalColor, 1.0);
}`;

// Configuración de Three.js
var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

var renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio)
var canvas = renderer.domElement;
renderer.setViewport(0, 0, canvas.width, canvas.height)

document.body.appendChild(canvas);
var scrollElement = document.getElementById("scroll");
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
    iMouse: { value: new THREE.Vector4() }
};

// Crear el material utilizando el fragment shader
var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: fragmentShaderCode
});

// Crear el plano y aplicar el material
var plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// Configuración de la cámara
camera.position.z = 5;

// Función de renderizado
function render() {
  requestAnimationFrame(render);
  uniforms.iTime.value += 0.01 * (1.1 - scrollValue); // Actualizar el tiempo para la animación
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

scrollElement.addEventListener("scroll", (event) => {
  scrollValue = Math.sqrt(scrollElement.scrollTop / (scrollElement.scrollHeight - window.innerHeight));
});


// Function to load JSON data
async function loadImages() {
  const response = await fetch('./images.json');
  if (!response.ok) {
    throw new Error('Failed to load images.json');
  }
  return await response.json();
}

// Initialize the project gallery
async function initGallery() {
  const images = await loadImages();
  var thumbnail = document.getElementById("thumbnail");
  var projectTitle = document.getElementById("project-title");
  var projectDescription = document.getElementById("project-description");
  var projectImage1 = document.getElementById("project-image1");
  var projectImage2 = document.getElementById("project-image2");
  var projectNumber = document.getElementById("project-number");

  var imageIndex = 0;

  document.getElementById("project-left").addEventListener("click", (event)=>{
    imageIndex--;
    if(imageIndex===-1){
      imageIndex = images.length -1;
    }
    thumbnail.firstChild.setAttribute("src", images[imageIndex].source)
    thumbnail.setAttribute("href", images[imageIndex].href)
    projectTitle.innerHTML = images[imageIndex].title;
    projectDescription.innerHTML = images[imageIndex].description;
    projectImage1.setAttribute("src", images[imageIndex].image1);
    projectImage2.setAttribute("src", images[imageIndex].image2);

    projectNumber.innerText = (imageIndex+1) + "/" + images.length;
  })

  document.getElementById("project-right").addEventListener("click", (event)=>{
    imageIndex++;
    if(imageIndex===images.length){
      imageIndex = 0;
    }
    thumbnail.firstChild.setAttribute("src", images[imageIndex].source)
    thumbnail.setAttribute("href", images[imageIndex].href)
    projectTitle.innerHTML = images[imageIndex].title;
    projectDescription.innerHTML = images[imageIndex].description;
    projectImage1.setAttribute("src", images[imageIndex].image1);
    projectImage2.setAttribute("src", images[imageIndex].image2);

    projectNumber.innerText = (imageIndex+1) + "/" + images.length;
  })
}

// Call the initGallery function to initialize the gallery
initGallery();

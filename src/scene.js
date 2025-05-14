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

/*
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
*/

var shaderCode = `uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;
uniform float iScroll;

vec3 palette( float t ) 
{
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 0.718, 0.1);
    vec3 d = vec3(0.984,0.522,0.0);

    return a + b*cos( 6.28318*(c*t+d) );
}

float easeInOutCubic(float x)
{
    if( x < 0.5){
        return 4.0 * x * x * x;
    }
    return 1.0 - pow(-2.0 * x + 2.0, 3.0) * 0.5;
}

float scrollColorDecay(float value)
{
    return 1.0-0.95*easeInOutCubic(pow(value, 0.2));
}
vec3 palette1(float t)
{
    vec3 a = vec3(1.0, 1.0, 1.0);
    vec3 b = vec3(1.0, 0.5, 0.0);
    vec3 c = vec3(0.5, 1.0, 0.0);
    
    float value = sin(t) * 0.5 + 0.25;
    
    return value * b + (1.0 - value) * c;
}

vec3 palette2(float t, float t2)
{
    vec3 a = vec3(0.0, 0.5, 1.0);
    vec3 b = vec3(1.0, 0.5, 0.0);
    vec3 c = vec3(0.5, 1.0, 0.0);
    
    float value = t * 0.5 + 0.25;
    float value2 = sin(t2) * 0.5 + 0.25;
    
    return value2 * (value * b + (1.0 - value) * c) + (1.0 - value2) * a;
}

vec3 palette3(float t)
{
    vec3 a = vec3(1.0, 1.0, 1.0);
    vec3 b = vec3(0.0, 0.5, 1.0);
    vec3 c = vec3(0.5, 1.0, 0.0);
    
    float value = sin(t) * 0.5 + 0.25;
    
    return value * b + (1.0 - value) * c;
}


vec3 third(vec2 uv)
{
    float s = sin(-iTime-length(uv));
    float s2 = sin((-iTime-length(uv))*0.5- 0.2);
    
    float d = pow(0.01/abs(s), 0.5) + pow(0.01/abs(s2), 0.5);
    
    float p = pow(abs(cos(s)/length(uv)*0.25), 8.0);
    
    vec2 newUV = uv * exp(-0.1*length(uv))*10.0;
    
    float y = 0.5*cos(abs(uv.x)*5.0-iTime*15.0)*sin(iTime*3.0);
    float e = max(abs(y-newUV.y)+length(uv)* 1.0, 0.0);
    
    e = pow(0.1/e, 1.1)*pow(1.2*abs(cos(abs(uv.x)*0.7-iTime*1.0)), 15.0);
    
    
    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
    
    color += vec4(p*palette2(uv.y/length(uv)*2.0, length(uv)*5.0), 1.0);
    
    color += vec4(d*palette1(-iTime + length(uv)), 1.0);
    
    color += vec4(e*palette3(-iTime + abs(uv.y)*3.0), 1.0);
    
    return 0.5*clamp(color.rgb, 0.0, 1.0);
}

vec3 first(vec2 uvIn)
{
    vec2 uv0 = uvIn;
    vec2 uv = uvIn;
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

    finalColor = clamp(pow(finalColor, vec3(1.1)), 0.0, 5.0);
    return finalColor;
}

void main() 
{
    vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / max(iResolution.x, iResolution.y);
    float scrollLerp = 1.0-(scrollColorDecay(iScroll) - 0.05)/0.95;
    float d = length(iMouse.xy - gl_FragCoord.xy) / max(iResolution.x, iResolution.y);;
    float v = abs(d * 2.5);
    v = easeInOutCubic(v);
    v = clamp(v, 0.0, 1.0);
    vec3 finalColor =  (first(uv)*scrollLerp + (1.0-scrollLerp) *third(uv))* v * scrollColorDecay(iScroll);

    gl_FragColor = vec4(finalColor, 1.0);
}`

var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: shaderCode
});
// Crear el plano y aplicar el material
var plane = new THREE.Mesh(geometry, material);
scene.add(plane);

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
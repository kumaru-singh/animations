import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';
export { scene, camera, renderer };
import fireParticles, { updateFire } from './fireParticles.js';
import { scene, camera, renderer } from './setup.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Handle Window Resize




scene.add(fireParticles);

function animate() {
    requestAnimationFrame(animate);
    
    updateFire(0.02);
    
    renderer.render(scene, camera);
}

animate();
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

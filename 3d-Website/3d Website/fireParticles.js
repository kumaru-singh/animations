import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';
import { fireShader } from 'fireShader.js';

const particleCount = 500;
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1.5;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = Math.random() * 0.05;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

    sizes[i] = Math.random() * 5 + 2;
}

// Create Geometry and Buffers
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const particleMaterial = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader: fireShader.vertex,
    fragmentShader: fireShader.fragment,
    transparent: true,
    blending: THREE.AdditiveBlending,
});

const fireParticles = new THREE.Points(particleGeometry, particleMaterial);

export function updateFire(deltaTime) {
    particleMaterial.uniforms.time.value += deltaTime;
}

export default fireParticles;

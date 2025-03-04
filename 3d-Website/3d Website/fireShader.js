export const fireShader = {
    vertex: `
        uniform float time;
        attribute float size;
        attribute vec3 velocity;
        varying float vOpacity;

        void main() {
            vec3 newPosition = position + velocity * time;
            vOpacity = 1.0 - (time * 0.5);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            gl_PointSize = size;
        }
    `,
    fragment: `
        varying float vOpacity;

        void main() {
            gl_FragColor = vec4(1.0, 0.5, 0.0, vOpacity);
        }
    `
};

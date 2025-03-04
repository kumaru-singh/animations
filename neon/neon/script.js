import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

window.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    // Camera
    const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 3, 20, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Lighting
    const light = new BABYLON.PointLight('light', new BABYLON.Vector3(0, 10, 0), scene);
    light.intensity = 0.8;

    // Ground
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 50, height: 50 }, scene);
    const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    ground.material = groundMaterial;

    // Neon Sign
    const neonSign = BABYLON.MeshBuilder.CreatePlane('neonSign', { width: 6, height: 2 }, scene);
    neonSign.position.y = 5;
    neonSign.position.z = -5;

    const neonMaterial = new BABYLON.StandardMaterial('neonMaterial', scene);
    neonMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0.8); // Neon pink
    neonSign.material = neonMaterial;

    // Animate the neon flicker
    scene.registerBeforeRender(() => {
        neonMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0.8).scale(0.8 + 0.2 * Math.random());
    });

    // Render Loop
    engine.runRenderLoop(() => {
        scene.render();
    });

    // Resize event
    window.addEventListener('resize', () => {
        engine.resize();
    });
});

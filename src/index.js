import * as Three from 'three';
import stemTexture from './assets/stem.jpg';
import leafTexture from './assets/leaf.jpg';
import soilTexture from './assets/soil.jpg';
import potTexture from './assets/pot.jpg';

let scene, camera, renderer;
let sway = 0;
let growth = 0;

const textureLoader = new Three.TextureLoader();
const stemMap = textureLoader.load(stemTexture);
const leafMap = textureLoader.load(leafTexture);
const soilMap = textureLoader.load(soilTexture);
const potMap = textureLoader.load(potTexture);

scene = new Three.Scene();
camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 1;
camera.position.z = 6;
camera.lookAt(0, 0, 0);
renderer = new Three.WebGLRenderer({antialias: true, alpha: true});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new Three.DirectionalLight(0xffffff, 1);
light.position.set(3, 5, 3);
scene.add(light);
scene.add(new Three.AmbientLight(0xffffff, 1));

const plant = new Three.Group();
const stem = new Three.Mesh(
    new Three.CylinderGeometry(0.1, 0.1, 2.2, 16),
    new Three.MeshStandardMaterial({ map: stemMap })
);
stem.position.y = 1.2;
plant.add(stem);

const leaves = new Three.Group();
const leafGeometry = new Three.SphereGeometry(0.28, 20, 20);
for (let i = 0; i < 6; i++) {
    const leaf = new Three.Mesh(
        leafGeometry, new Three.MeshStandardMaterial({ map: leafMap })
    );

    leaf.scale.set(1.8, 0.35, 0.8);
    leaf.position.y = 0.7 + (i * 0.3);

    if (i % 2 === 0) {
        leaf.position.x = 0.3;
        leaf.rotation.z = Math.PI / 4;
    } else {
        leaf.position.x = -0.3;
        leaf.rotation.z = -Math.PI / 4;
    }

    leaves.add(leaf);
}
plant.add(leaves);

const pot = new Three.Mesh(
    new Three.CylinderGeometry(0.9, 0.65, 1, 24),
    new Three.MeshStandardMaterial({ map: potMap })
);
pot.position.y = -0.5;
plant.add(pot);

const soil = new Three.Mesh(
    new Three.CylinderGeometry(0.82, 0.82, 0.08, 24),
    new Three.MeshStandardMaterial({ map: soilMap })
);
soil.position.y = -0.02;
plant.add(soil);

plant.position.y = -1.3;
scene.add(plant);

function animate() {
    requestAnimationFrame(animate);
    sway += 0.03;
    plant.rotation.z = Math.sin(sway) * 0.03;
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function waterPlant() {
    if (growth < 100) {

        growth += 20;
        stem.scale.y += 0.15;
        stem.position.y += 0.15;
        leaves.scale.x += 0.25;
        leaves.scale.y += 0.15;
        leaves.scale.z += 0.25;

        document.getElementById('growth').innerHTML = `Growth: ${growth}%`;
    }
}

document.getElementById('waterButton').addEventListener('click', waterPlant);
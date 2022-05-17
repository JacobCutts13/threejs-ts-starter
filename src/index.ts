import {
    Scene,
    Mesh,
    MeshStandardMaterial,
    BoxBufferGeometry,
    TetrahedronGeometry,
    TorusGeometry,
    BoxGeometry,
    Group,

} from 'three';
import { createAddBoxCluster } from './boxCluster';
import { loadModel } from './loadModel';
import { setupCamera } from './setupCamera';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';

export async function setupThreeJSScene() {

    let dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const controls = setupOrbitControls(camera, renderer.domElement);

    let scene = new Scene();

    setupLights(scene);

    setupHelpers(scene);

    //shape(s)
    const boxArray = createAddBoxCluster(scene, 20, 50);

    const model: Group | null = await loadModel("./assets/model.gltf")

    if (model) {
        model.scale.set(5, 5, 5)
        scene.add(model);
    }

    animate();


    function animate() {
        // centreCube.rotation.y += 0.01;
        // centreCube.rotation.x += 0.02;
        for (let box of boxArray) {
            box.rotation.x += box.userData.speed * 0.01;

        }
        const infoEl = document.getElementById('info')
        if (infoEl) {
            infoEl.innerText = "First box rotation:" + boxArray[0].rotation.x.toFixed(1);
        }
        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        requestAnimationFrame(animate);
    }
}

setupThreeJSScene();

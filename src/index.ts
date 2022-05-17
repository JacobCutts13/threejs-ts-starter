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

    // const controls = setupOrbitControls(camera, renderer.domElement);

    let scene = new Scene();

    setupLights(scene);

    setupHelpers(scene);

    //shape(s)
    // const boxArray = createAddBoxCluster(scene, 20, 50);

    const model: Group | null = await loadModel("./assets/model.gltf")

    if (model) {
        model.scale.set(5, 5, 5)
        model.rotation.y += Math.PI;
        scene.add(model);
    }

    let frameCount = 0;

    animate();

    function animate() {
        // centreCube.rotation.y += 0.01;
        // centreCube.rotation.x += 0.02;
        // for (let box of boxArray) {
        //     box.rotation.x += box.userData.speed * 0.01;
        // }
        if (model) {
            model.position.z -= 0.1;
            camera.position.z = model.position.z + 30 * Math.sin(frameCount / 200);
            camera.position.x = model.position.x + 30 * Math.cos(frameCount / 200)
            camera.lookAt(model.position);
        }
        const infoEl = document.getElementById('info')
        if (infoEl) {
            infoEl.innerText = "Moving car";
        }
        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        // controls.update();

        requestAnimationFrame(animate);

        frameCount++;
    }
}

setupThreeJSScene();

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
import { dumpObjectToConsoleAsString } from './debugUtils';
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

    const mouse = { x: 0, y: 0 };
    renderer.domElement.addEventListener("mousemove", (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    })

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
        model.traverse((child) => {
            if (child.name.startsWith("wheel")) {
                child.scale.multiplyScalar(10);
            }

        })
        scene.add(model);
    }

    let frameCount = 0;

    animate();

    dumpObjectToConsoleAsString(model!);

    function animate() {
        // centreCube.rotation.y += 0.01;
        // centreCube.rotation.x += 0.02;
        // for (let box of boxArray) {
        //     box.rotation.x += box.userData.speed * 0.01;
        // }
        if (model) {
            model.position.z -= 0.1;
            //const t = map(mouse.x, 0, dimensions.w, 0, 2*Math.PI) //TODO get element using dom
            const t = (mouse.x / 1920) * 2 * Math.PI;
            camera.position.z = model.position.z + 30 * Math.sin(t);
            camera.position.x = model.position.x + 30 * Math.cos(t);
            camera.position.y = 50 * (1 - (mouse.y / 1080))  //50 ==> 0
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

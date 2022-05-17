import { BoxGeometry, Mesh, MeshStandardMaterial, Scene } from "three";

export function createAddBoxCluster(scene: Scene, nBoxes: number, range: number): Mesh[] {
    const geometry = new BoxGeometry(10, 10, 10);
    const material = new MeshStandardMaterial({
        color: 0xffffff
    });
    const clusterArray: Mesh[] = [];

    for (let i = 0; i < nBoxes; i++) {
        const cuboid: Mesh = new Mesh(geometry, material);
        cuboid.scale.multiplyScalar(Math.random())
        cuboid.position.x = (Math.random() - 0.5) * range;
        cuboid.position.z = (Math.random() - 0.5) * range;
        cuboid.position.z = (Math.random() - 0.5) * range;
        cuboid.rotation.x += (Math.random() - 0.5) * 2 * Math.PI;
        cuboid.rotation.y += (Math.random() - 0.5) * 2 * Math.PI;
        cuboid.rotation.z += (Math.random() - 0.5) * 2 * Math.PI;
        cuboid.userData.speed = Math.random();
        scene.add(cuboid);
        clusterArray.push(cuboid)
    }
    return clusterArray;
}
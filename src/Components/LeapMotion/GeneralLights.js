import * as THREE from 'three'

export default scene => {
    const lightIn = new THREE.DirectionalLight("#d0d1d6", 0.2);
    lightIn.position.set(0, 500, 40);

    const directionalLight = new THREE.DirectionalLight("#99cbf1", 1.1);
    directionalLight.position.set(0, 0.5, 1);

    scene.add(lightIn);
    scene.add(directionalLight);

    const rad = 80;

    function update(time) {
        //lightIn.position.x = rad * Math.sin(time * 3.2);
        //lightIn.position.y = rad * Math.cos(time * 3.2);
    }

    return {
        update
    }
}
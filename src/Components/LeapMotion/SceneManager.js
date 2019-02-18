import * as THREE from 'three';
import GeneralLights from './GeneralLights';

import Leap from 'leapjs';
import 'leapjs-plugins';

//const OrbitControls = require("three-orbit-controls")(THREE);

export default canvas => {
    const clock = new THREE.Clock();
    const origin = new THREE.Vector3(0, 0, 0);
    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    };
    const mousePosition = {
        x: 0,
        y: 0
    };

    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
    const sceneSubjects = createSceneSubjects(scene);

    const leapController = setupLeap(scene, renderer, camera);
    const leapPlayer = initPlayer(leapController);

    window.leapController = leapController;
    window.leapPlayer = leapPlayer;

    window.saveToFile = () => saveToFile();
    //const orbitControls = buildControls(camera, renderer.domElement);
    window.playFromFile = () => playFromFile();

    createDummyLeapObject();

    function saveToFile(){
        // let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        // let downloadAnchorNode = document.createElement('a');
        // downloadAnchorNode.setAttribute("href",     dataStr);
        // downloadAnchorNode.setAttribute("download", exportName + ".json");
        // document.body.appendChild(downloadAnchorNode); // required for firefox
        // downloadAnchorNode.click();
        // downloadAnchorNode.remove();

        window.recording = leapPlayer.recording;
    }

    function playFromFile(){
        //let data = require('../../../leapPlayer.json');
        //console.log("DATA", data.frameData[0]);


        //window.leapPlayer.play(data.frameData);

        //window.leapPlayer.setRecording({recording: data});

        /*const dummy = {
        
        //leapPlayer.recording = window.recording;
        //leapPlayer.recording = dummy;
        //window.leapPlayer.recording = data;

        leapPlayer.setRecording();
    }

    /*
    function buildControls(camera)
        const controls = new OrbitControls(camera);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        return controls;
    }
    */

    function createDummyLeapObject(){
        let geometry = new THREE.CubeGeometry(50, 30, 10);
        let material = new THREE.MeshPhongMaterial({color: "#00ac80"});
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 5, 0);
        cube.rotateX(90);
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);

        renderer.render(scene, camera);
    }
    
    function buildScene() {
        const scene = new THREE.Scene();
        //scene.background = new THREE.Color("#dbedff");

        let plane = new THREE.Mesh(
            new THREE.PlaneGeometry(80,80),
            new THREE.MeshPhongMaterial({wireframe: false, side: THREE.DoubleSide, color: "#ffffff"})
        );
        plane.scale.set(4,4,4);
        plane.rotateX(90);
        plane.position.set(0,0,0);
        plane.receiveShadow = true;
        scene.add(plane);

        return scene;
    }

    function buildRender({width, height}) {
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });

        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        //let axisHelper = new THREE.AxisHelper( 100 );
        //scene.add( axisHelper );

        return renderer;
    }

    function buildCamera({width, height}) {
        const aspectRatio = width / height;
        const fieldOfView = 45;
        const nearPlane = 1;
        const farPlane = 1000;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.set(0, 200, 800);
        camera.lookAt(new THREE.Vector3(0, 200, 0));

        return camera;
    }

    function createSceneSubjects(scene) {
        return [
            new GeneralLights(scene)
        ];
    }

    function initPlayer(leapController){
        leapController.use('playback', {autoPlay: false});
        leapController.plugins.playback.player.overlay = null;
        return leapController.plugins.playback.player;
    }

    function setupLeap(scene, renderer, camera) {
        let colors = [0x1e90ff, 0x111111, 0x00d6c2];
        let baseBoneRotation = (new THREE.Quaternion()).setFromEuler(
            new THREE.Euler(Math.PI / 2, 0, 0)
        );

        return Leap.loop({
            hand: (hand) => {
                hand.fingers.forEach(function (finger) {
                    finger.data('boneMeshes').forEach(function (mesh, i) {
                        let bone = finger.bones[i];
                        mesh.position.fromArray(bone.center());
                        mesh.setRotationFromMatrix(
                            (new THREE.Matrix4()).fromArray(bone.matrix())
                        );
                        mesh.quaternion.multiply(baseBoneRotation);
                    });
                    finger.data('jointMeshes').forEach(function (mesh, i) {
                        let bone = finger.bones[i];
                        if (bone) {
                            mesh.position.fromArray(bone.prevJoint);
                        } else {
                            bone = finger.bones[i - 1];
                            mesh.position.fromArray(bone.nextJoint);
                        }
                    });
                });

                let armMesh = hand.data('armMesh');
                if (armMesh) {
                    armMesh.position.fromArray(hand.arm.center());
                    armMesh.setRotationFromMatrix(
                        (new THREE.Matrix4()).fromArray(hand.arm.matrix())
                    );
                    armMesh.quaternion.multiply(baseBoneRotation);
                    armMesh.scale.x = hand.arm.width / 2;
                    armMesh.scale.z = hand.arm.width / 4;
                }

                renderer.render(scene, camera);
            }
        })
            .use('handHold')
            .use('handEntry')
            .on('handFound', (hand) => {
                hand.fingers.forEach(function (finger) {
                    let boneMeshes = [];
                    let jointMeshes = [];
                    finger.bones.forEach(function (bone) {
                        let boneMesh = new THREE.Mesh(
                            new THREE.CylinderGeometry(5, 5, bone.length),
                            new THREE.MeshPhongMaterial()
                        );
                        boneMesh.material.color.setHex(colors[1]);
                        scene.add(boneMesh);
                        boneMeshes.push(boneMesh);
                    });
                    for (let i = 0; i < finger.bones.length + 1; i++) {
                        let jointMesh = new THREE.Mesh(
                            new THREE.SphereGeometry(10),
                            new THREE.MeshPhongMaterial()
                        );
                        jointMesh.material.color.setHex(colors[2]);
                        scene.add(jointMesh);
                        jointMeshes.push(jointMesh);
                    }
                    finger.data('boneMeshes', boneMeshes);
                    finger.data('jointMeshes', jointMeshes);
                });
                if (hand.arm) {
                    let armMesh = new THREE.Mesh(
                        new THREE.CylinderGeometry(1, 1, hand.arm.length, 64),
                        new THREE.MeshPhongMaterial()
                    );
                    armMesh.material.color.setHex(colors[0]);
                    scene.add(armMesh);
                    hand.data('armMesh', armMesh);
                }
            })
            .on('handLost', function (hand) {
                hand.fingers.forEach(function (finger) {
                    let boneMeshes = finger.data('boneMeshes');
                    let jointMeshes = finger.data('jointMeshes');
                    boneMeshes.forEach(function (mesh) {
                        scene.remove(mesh);
                    });
                    jointMeshes.forEach(function (mesh) {
                        scene.remove(mesh);
                    });
                    finger.data({
                        boneMeshes: null,
                        jointMeshes: null
                    });
                });
                let armMesh = hand.data('armMesh');
                if (armMesh) {
                    scene.remove(armMesh);
                    hand.data('armMesh', null);
                }
                renderer.render(scene, camera);
            })
            .connect();
    }

    function update() {
        const elapsedTime = clock.getElapsedTime();

        for (let i = 0; i < sceneSubjects.length; i++)
            sceneSubjects[i].update(elapsedTime);

        updateCameraPositionRelativeToMouse();

        renderer.render(scene, camera);
    }

    function updateCameraPositionRelativeToMouse() {
        camera.position.x += ((mousePosition.x * 0.05) - camera.position.x) * 0.05;
        camera.lookAt(new THREE.Vector3(origin.x, 100, origin.z));
    }

    function onWindowResize() {
        const {width, height} = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }

    function onMouseMove(x, y) {
        mousePosition.x = x;
        mousePosition.y = y;
    }

    return {
        update,
        onWindowResize,
        onMouseMove
    }
}
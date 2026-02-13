
import * as THREE from 'three';

export class BaseScene {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.group = new THREE.Group();
    }

    enter() {
        // Override me
    }

    exit() {
        // Override me
    }

    update() {
        // Override me
    }
}

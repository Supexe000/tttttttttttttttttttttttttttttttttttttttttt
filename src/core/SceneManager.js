
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export class SceneManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Post Processing
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // Bloom
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // strength
            0.4, // radius
            0.85 // threshold
        );
        this.composer.addPass(bloomPass);

        this.scenes = {}; // Map of scene instances
        this.currentScene = null;

        // Basic camera setup
        this.camera.position.z = 5;

        window.addEventListener('resize', this.onResize.bind(this));

        // Start Render Loop
        this.animate();
    }

    addScene(name, sceneInstance) {
        this.scenes[name] = sceneInstance;
        this.scene.add(sceneInstance.group);
        sceneInstance.group.visible = false; // Hide initially
    }

    switchScene(name) {
        if (this.currentScene) {
            this.currentScene.exit();
            this.currentScene.group.visible = false;
        }

        const nextScene = this.scenes[name];
        if (nextScene) {
            nextScene.group.visible = true;
            nextScene.enter();
            this.currentScene = nextScene;
        }
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        if (this.currentScene) {
            this.currentScene.update();
        }

        // this.renderer.render(this.scene, this.camera);
        this.composer.render();
    }
}


import * as THREE from 'three';
import gsap from 'gsap';
import { BaseScene } from './BaseScene.js';

export class UniverseScene extends BaseScene {
    constructor(sceneManager) {
        super(sceneManager);
        this.stars = null;
        this.storm = null;
        this.isStormActive = true;
        this.createStars();
        this.createStorm();
        this.setupUI();
    }

    createStars() {
        const starCount = 5000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });

        this.stars = new THREE.Points(geometry, material);
        this.group.add(this.stars);
    }

    createStorm() {
        const cloudCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(cloudCount * 3);
        const colors = new Float32Array(cloudCount * 3);

        const color1 = new THREE.Color(0x333333); // Dark grey
        const color2 = new THREE.Color(0x111111); // Blackish

        for (let i = 0; i < cloudCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2 + 2; // Closer to camera

            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.NormalBlending
        });

        this.storm = new THREE.Points(geometry, material);
        this.group.add(this.storm);
    }

    setupUI() {
        const uiContent = `
            <div class="universe-container">
                <div id="storm-msg" class="active">
                    <h2>A storm is blocking the way...</h2>
                    <p>Tap the storm clouds to clear them</p>
                </div>
                <div id="apology-msg" class="hidden">
                     <h1>Mano jaan... I’m truly sorry 😔</h1>
                     <p>My anger spoke faster than my heart.<br>You deserve softness, not storms.</p>
                     <button id="universe-next-btn">Continue 💫</button>
                </div>
            </div>
            <style>
                .universe-container { text-align: center; color: white; }
                .hidden { opacity: 0; pointer-events: none; transition: opacity 1s; display: none; }
                .active { opacity: 1; pointer-events: auto; display: block; }
            </style>
        `;
        window.uiManager.createUI('universe', uiContent);

        // We need a persistent click listener for the storm clearing interaction
        // Since the storm is a 3D object, we ideally use Raycaster, but for simplicity
        // let's stick to a DOM overlay or global click if it's the main interaction.
        // Actually, let's use a full screen transparent div for "touching the storm".

        // Let's modify the UI content to include an overlay for clicking
        const container = document.createElement('div');
        container.id = 'storm-overlay';
        container.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; z-index:5; cursor:pointer;';
        document.querySelector('#ui-universe').appendChild(container);

        container.addEventListener('click', () => this.clearStorm());

        setTimeout(() => {
            const btn = document.querySelector('#ui-universe #universe-next-btn');
            if (btn) btn.addEventListener('click', () => this.onNextClick());
        }, 100);
    }

    clearStorm() {
        if (!this.isStormActive) return;
        this.isStormActive = false;

        // Animate storm away
        gsap.to(this.storm.material, {
            opacity: 0,
            duration: 2,
            onComplete: () => {
                this.storm.visible = false;
            }
        });

        gsap.to(this.storm.scale, {
            x: 5, y: 5, z: 5,
            duration: 2
        });

        // Show Apology
        document.querySelector('#ui-universe #storm-msg').classList.remove('active');
        document.querySelector('#ui-universe #storm-msg').classList.add('hidden');
        document.querySelector('#ui-universe #storm-overlay').style.display = 'none';

        const apologyMsg = document.querySelector('#ui-universe #apology-msg');
        apologyMsg.classList.remove('hidden');
        apologyMsg.classList.add('active');

        // Change background color or light
        gsap.to(this.stars.material, {
            color: new THREE.Color(0xFFAABB), // Pinkish tint
            duration: 3
        });
    }

    onNextClick() {
        this.sceneManager.switchScene('heart');
    }

    enter() {
        window.uiManager.showUI('universe');
        this.isStormActive = true;
        this.storm.visible = true;
        this.storm.material.opacity = 0.9;
        this.storm.scale.set(1, 1, 1);

        // Reset UI
        document.querySelector('#ui-universe #storm-msg').classList.add('active');
        document.querySelector('#ui-universe #storm-msg').classList.remove('hidden');

        const apologyMsg = document.querySelector('#ui-universe #apology-msg');
        apologyMsg.classList.add('hidden');
        apologyMsg.classList.remove('active');

        document.querySelector('#ui-universe #storm-overlay').style.display = 'block';
    }

    exit() {
        // Cleanup if needed
    }

    update() {
        // Star rotation
        this.stars.rotation.y += 0.0005;
        this.stars.rotation.x += 0.0002;

        if (this.isStormActive) {
            this.storm.rotation.z += 0.001;
            // Jitter for storm effect
            this.storm.position.x = (Math.random() - 0.5) * 0.05;
            this.storm.position.y = (Math.random() - 0.5) * 0.05;
        }
    }
}

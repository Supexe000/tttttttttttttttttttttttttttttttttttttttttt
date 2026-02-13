
import * as THREE from 'three';
import gsap from 'gsap';
import { BaseScene } from './BaseScene.js';

export class HeartScene extends BaseScene {
    constructor(sceneManager) {
        super(sceneManager);
        this.heartMesh = null;
        this.lights = [];
        this.createCrystalHeart();
        this.createLights();
        this.setupUI();
    }

    createCrystalHeart() {
        const x = 0, y = 0;
        const heartShape = new THREE.Shape();
        heartShape.moveTo(x + 5, y + 5);
        heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
        heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
        heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
        heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
        heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
        heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

        const extrudeSettings = {
            depth: 4,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 1,
            bevelThickness: 1
        };

        const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        // Center the geometry
        geometry.center();
        // Rotation to face camera
        geometry.rotateZ(Math.PI);

        const material = new THREE.MeshPhysicalMaterial({
            color: 0xff4d6d,
            metalness: 0,
            roughness: 0.1,
            transmission: 0.9, // Add transparency
            thickness: 2, // Add refraction
            clearcoat: 1,
            clearcoatRoughness: 0.1,
        });

        this.heartMesh = new THREE.Mesh(geometry, material);
        this.heartMesh.scale.set(0.1, 0.1, 0.1);
        this.group.add(this.heartMesh);

        // Add a glow sprite behind
        const spriteMaterial = new THREE.SpriteMaterial({
            color: 0xff4d6d,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(10, 10, 1);
        sprite.position.z = -1;
        this.group.add(sprite);
    }

    createLights() {
        const light1 = new THREE.PointLight(0xffffff, 2, 50);
        light1.position.set(5, 5, 5);
        this.group.add(light1);
        this.lights.push(light1);

        const light2 = new THREE.PointLight(0xff8fa3, 2, 50);
        light2.position.set(-5, -5, 5);
        this.group.add(light2);
        this.lights.push(light2);

        const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
        this.group.add(ambientLight);
    }

    setupUI() {
        const uiContent = `
            <div class="heart-container" style="text-align:center; color:white; pointer-events:none;">
                <div id="heart-msg" class="hidden">
                    <h1 style="color:#ff8fa3; text-shadow:0 0 10px #ff4d6d">Cutie patootie 💕</h1>
                    <p>You are my calm, my happiness, my safe place.<br>I want to be better for you.</p>
                    <button id="heart-next-btn" style="pointer-events:auto;">Continue ✨</button>
                </div>
                <div id="heart-instr" style="margin-top: 80vh; opacity:0.8;">
                    <p>Tap the heart ❤️</p>
                </div>
            </div>
            <style>
                .hidden { opacity: 0; pointer-events: none; transition: opacity 1s; display: none; }
                .active { opacity: 1; pointer-events: auto; display: block; }
            </style>
        `;
        window.uiManager.createUI('heart', uiContent);

        // Click interaction on the 3D heart
        // Ideally use Raycaster, but for speed, let's use a centered invisible div
        const clickZone = document.createElement('div');
        clickZone.style.cssText = 'position:absolute; top:35%; left:35%; width:30%; height:30%; z-index:10; cursor:pointer; border-radius:50%;';
        clickZone.id = 'heart-click-zone';
        document.querySelector('#ui-heart').appendChild(clickZone);

        clickZone.addEventListener('click', () => this.onHeartClick());

        setTimeout(() => {
            const btn = document.querySelector('#ui-heart #heart-next-btn');
            if (btn) btn.addEventListener('click', () => this.onNextClick());
        }, 100);
    }

    onHeartClick() {
        // Shine/Pulse effect
        gsap.to(this.heartMesh.scale, {
            x: 0.15, y: 0.15, z: 0.15,
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });

        gsap.to(this.heartMesh.material, {
            emissive: new THREE.Color(0xff4d6d),
            emissiveIntensity: 1,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });

        // Show message
        document.querySelector('#ui-heart #heart-msg').classList.remove('hidden');
        document.querySelector('#ui-heart #heart-msg').classList.add('active');
        document.querySelector('#ui-heart #heart-instr').style.display = 'none';

        // Disable click zone
        document.querySelector('#ui-heart #heart-click-zone').style.display = 'none';

        // Add particles explosion (simple logic placeholder)
        this.addExplosion();
    }

    addExplosion() {
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;

            velocities.push({
                x: (Math.random() - 0.5) * 0.2,
                y: (Math.random() - 0.5) * 0.2,
                z: (Math.random() - 0.5) * 0.2
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xffeb3b,
            size: 0.1,
            transparent: true
        });

        const explosion = new THREE.Points(geometry, material);
        this.group.add(explosion);

        // Animate explosion manually in update loop for simplicity, or use GSAP
        // Using simple GSAP on the points object won't work easily for individual particles
        // Let's store reference for update loop
        this.explosion = { mesh: explosion, velocities: velocities, age: 0 };
    }

    onNextClick() {
        this.sceneManager.switchScene('memory');
    }

    enter() {
        window.uiManager.showUI('heart');
        this.heartMesh.rotation.y = 0;

        // Reset/Init states
        document.querySelector('#ui-heart #heart-msg').classList.add('hidden');
        document.querySelector('#ui-heart #heart-msg').classList.remove('active');

        document.querySelector('#ui-heart #heart-instr').style.display = 'block';
        document.querySelector('#ui-heart #heart-click-zone').style.display = 'block';
    }

    update() {
        if (this.heartMesh) {
            this.heartMesh.rotation.y += 0.01;
            this.heartMesh.rotation.z = Math.sin(Date.now() * 0.001) * 0.1 + Math.PI; // Float + face correction (rotateZ PI was setting it upside down/correctly?)
            // wait, in createCrystalHeart I did rotateZ(Math.PI). 
            // Heart shape in 2D is usually upside down or right side up depending on coordinates. 
            // My coords: (0,0) start. +y is up.
            // 2D shape drawing seems correct for upright heart.
        }

        // Update lights
        const time = Date.now() * 0.001;
        this.lights[0].position.x = Math.sin(time) * 5;
        this.lights[0].position.z = Math.cos(time) * 5;

        this.lights[1].position.x = Math.cos(time) * 5;
        this.lights[1].position.z = Math.sin(time) * 5;

        // Update explosion
        if (this.explosion) {
            const positions = this.explosion.mesh.geometry.attributes.position.array;
            for (let i = 0; i < this.explosion.velocities.length; i++) {
                positions[i * 3] += this.explosion.velocities[i].x;
                positions[i * 3 + 1] += this.explosion.velocities[i].y;
                positions[i * 3 + 2] += this.explosion.velocities[i].z;
            }
            this.explosion.mesh.geometry.attributes.position.needsUpdate = true;
            this.explosion.mesh.material.opacity -= 0.02;
            if (this.explosion.mesh.material.opacity <= 0) {
                this.group.remove(this.explosion.mesh);
                this.explosion = null;
            }
        }
    }
}

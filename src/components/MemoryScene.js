
import * as THREE from 'three';
import gsap from 'gsap';
import { BaseScene } from './BaseScene.js';

export class MemoryScene extends BaseScene {
    constructor(sceneManager) {
        super(sceneManager);
        this.memories = [];
        this.currentIndex = 0;
        this.createMemoryGallery();
        this.setupUI();
    }

    createMemoryGallery() {
        const memoryData = [
            { color: 0xffadc9, text: "Your smile 🌸" }, // Pink
            { color: 0xffd700, text: "Your laugh ⭐" }, // Gold
            { color: 0xa0c4ff, text: "Us moments 🌅" }  // Blue
        ];

        memoryData.forEach((data, index) => {
            const geometry = new THREE.PlaneGeometry(3, 4);

            // Create texture with text
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#' + data.color.toString(16);
            ctx.fillRect(0, 0, 512, 512);
            ctx.fillStyle = 'white';
            ctx.font = '60px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(data.text, 256, 256);

            const texture = new THREE.CanvasTexture(canvas);

            const material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            });

            const mesh = new THREE.Mesh(geometry, material);

            // Position them spread out horizontally
            mesh.position.set(index * 5, 0, 0);
            // Add some random rotation
            mesh.rotation.y = (Math.random() - 0.5) * 0.5;
            mesh.rotation.z = (Math.random() - 0.5) * 0.2;

            this.group.add(mesh);
            this.memories.push(mesh);
        });
    }

    setupUI() {
        const uiContent = `
            <div class="memory-container" style="text-align:center; color:white;">
                <div id="memory-controls" class="active" style="position:fixed; bottom:10%; width:100%;">
                    <button id="prev-mem">❮</button>
                    <button id="next-mem">❯</button>
                </div>
                <div id="memory-msg" class="hidden">
                    <h2>I never want to be the reason you are sad 💔</h2>
                    <button id="memory-finish-btn">My Promise 🤞</button>
                </div>
            </div>
            <style>
                .active { opacity: 1; pointer-events: auto; }
                .hidden { opacity: 0; pointer-events: none; transition: opacity 0.5s; display: none; }
                #prev-mem, #next-mem { margin: 0 20px; font-size: 2rem; padding: 10px 20px; }
            </style>
        `;
        window.uiManager.createUI('memory', uiContent);

        setTimeout(() => {
            document.querySelector('#ui-memory #prev-mem').addEventListener('click', () => this.navigate(-1));
            document.querySelector('#ui-memory #next-mem').addEventListener('click', () => this.navigate(1));
            const btn = document.querySelector('#ui-memory #memory-finish-btn');
            if (btn) btn.addEventListener('click', () => this.onFinishClick());
        }, 100);
    }

    navigate(direction) {
        const newIndex = this.currentIndex + direction;

        if (newIndex >= 0 && newIndex < this.memories.length) {
            this.currentIndex = newIndex;
            this.updateCameraPosition();
        } else if (newIndex >= this.memories.length) {
            // Reached end
            this.showFinishUI();
        }
    }

    updateCameraPosition() {
        const targetX = this.currentIndex * 5;

        gsap.to(this.sceneManager.camera.position, {
            x: targetX,
            z: 5,
            duration: 1.5,
            ease: "power2.inOut"
        });

        gsap.to(this.sceneManager.camera.rotation, {
            y: 0,
            duration: 1.5
        });

        // Slight rotation for current memory
        gsap.to(this.memories[this.currentIndex].rotation, {
            y: 0,
            duration: 1
        });
    }

    showFinishUI() {
        document.querySelector('#ui-memory #memory-controls').classList.add('hidden');
        document.querySelector('#ui-memory #memory-controls').classList.remove('active');

        const msg = document.querySelector('#ui-memory #memory-msg');
        msg.classList.remove('hidden');
        msg.classList.add('active');
        msg.style.display = 'block';
    }

    onFinishClick() {
        this.sceneManager.switchScene('promise');
    }

    enter() {
        window.uiManager.showUI('memory');
        this.currentIndex = 0;
        this.sceneManager.camera.position.set(0, 0, 5);

        // Reset UI
        document.querySelector('#ui-memory #memory-controls').classList.remove('hidden');
        document.querySelector('#ui-memory #memory-controls').classList.add('active');
        document.querySelector('#ui-memory #memory-controls').style.display = 'block';

        document.querySelector('#ui-memory #memory-msg').classList.add('hidden');
        document.querySelector('#ui-memory #memory-msg').classList.remove('active');
    }

    update() {
        // Float effect for memories
        const time = Date.now() * 0.001;
        this.memories.forEach((mesh, i) => {
            if (i !== this.currentIndex) {
                mesh.rotation.y += Math.sin(time + i) * 0.002;
            }
            mesh.position.y = Math.sin(time * 2 + i) * 0.1;
        });
    }
}

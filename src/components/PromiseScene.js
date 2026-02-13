
import * as THREE from 'three';
import gsap from 'gsap';
import { BaseScene } from './BaseScene.js';

export class PromiseScene extends BaseScene {
    constructor(sceneManager) {
        super(sceneManager);
        this.book = null;
        this.createBook();
        this.setupUI();
    }

    createBook() {
        const geometry = new THREE.BoxGeometry(3, 4, 0.2);
        const material = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3, metalness: 0.8 });

        // Left page
        const leftPage = new THREE.Mesh(geometry, material);
        leftPage.position.x = -1.5;
        leftPage.rotation.y = Math.PI / 12; // Open slightly

        // Right page
        const rightPage = new THREE.Mesh(geometry, material);
        rightPage.position.x = 1.5;
        rightPage.rotation.y = -Math.PI / 12;

        this.book = new THREE.Group();
        this.book.add(leftPage);
        this.book.add(rightPage);

        // Add some glowing particles around the book
        const particleCount = 100;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            pPos[i * 3] = (Math.random() - 0.5) * 6;
            pPos[i * 3 + 1] = (Math.random() - 0.5) * 6;
            pPos[i * 3 + 2] = (Math.random() - 0.5) * 2;
        }

        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({ color: 0xffeb3b, size: 0.05, transparent: true, blending: THREE.AdditiveBlending });
        const particles = new THREE.Points(pGeo, pMat);
        this.book.add(particles);

        this.group.add(this.book);

        // Light for the book
        const pointLight = new THREE.PointLight(0xffaa00, 2, 10);
        pointLight.position.set(0, 2, 5);
        this.group.add(pointLight);
    }

    setupUI() {
        // We overlap HTMl checklist perfectly over the 3D book if possible, or just center it.
        const uiContent = `
            <div class="promise-container" style="color:black;">
                 <div class="checklist-card">
                    <h2>My Promises 📖</h2>
                    <label><input type="checkbox" class="promise-cb"> Stay calm</label>
                    <label><input type="checkbox" class="promise-cb"> Listen more</label>
                    <label><input type="checkbox" class="promise-cb"> Respect feelings</label>
                    <label><input type="checkbox" class="promise-cb"> Choose love over anger</label>
                 </div>
                 <div id="promise-final-msg" class="hidden">
                     <p>I don’t want to just say sorry — I want to prove change 🫶</p>
                     <button id="promise-next-btn">Confess Love 💌</button>
                 </div>
            </div>
            <style>
                .hidden { opacity: 0; pointer-events: none; transition: opacity 0.5s; display: none; }
                .active { opacity: 1; pointer-events: auto; display: block; }
                .promise-container {
                    background: rgba(255, 255, 255, 0.9);
                    padding: 40px;
                    border-radius: 10px;
                    width: 300px;
                    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
                    transform: rotate(-2deg);
                }
                .checklist-card label { display: block; margin: 15px 0; font-size: 1.2rem; cursor: pointer; text-align: left;}
                .checklist-card input { margin-right: 10px; transform: scale(1.5); }
            </style>
        `;
        window.uiManager.createUI('promise', uiContent);

        setTimeout(() => {
            const boxes = document.querySelectorAll('#ui-promise .promise-cb');
            boxes.forEach(box => box.addEventListener('change', () => this.checkPromises()));

            const btn = document.querySelector('#ui-promise #promise-next-btn');
            if (btn) btn.addEventListener('click', () => this.onNextClick());
        }, 100);
    }

    checkPromises() {
        const boxes = document.querySelectorAll('#ui-promise .promise-cb');
        const allChecked = Array.from(boxes).every(b => b.checked);

        if (allChecked) {
            document.querySelector('#ui-promise #promise-final-msg').classList.remove('hidden');
            document.querySelector('#ui-promise #promise-final-msg').classList.add('active');

            // Add extra glow
            gsap.to(this.book.scale, { x: 1.1, y: 1.1, z: 1.1, yoyo: true, repeat: 1, duration: 0.3 });
        }
    }

    onNextClick() {
        this.sceneManager.switchScene('finale');
    }

    enter() {
        window.uiManager.showUI('promise');
        this.sceneManager.camera.position.set(0, 0, 6);

        // Reset Checkboxes
        document.querySelectorAll('#ui-promise .promise-cb').forEach(b => b.checked = false);
        document.querySelector('#ui-promise #promise-final-msg').classList.add('hidden');
        document.querySelector('#ui-promise #promise-final-msg').classList.remove('active');
    }

    update() {
        // Floating book
        const time = Date.now() * 0.001;
        this.book.position.y = Math.sin(time) * 0.1;
        this.book.rotation.y = Math.sin(time * 0.5) * 0.05;
    }
}

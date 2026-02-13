
import * as THREE from 'three';
import gsap from 'gsap';
import { BaseScene } from './BaseScene.js';

export class FinaleScene extends BaseScene {
    constructor(sceneManager) {
        super(sceneManager);
        this.fireworks = [];
        this.setupUI();
        this.createParticles();
    }

    createParticles() {
        // Just ambient falling petals
        const petalCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(petalCount * 3);

        for (let i = 0; i < petalCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = Math.random() * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ color: 0xff0000, size: 0.1 });
        this.petals = new THREE.Points(geometry, material);
        this.group.add(this.petals);
    }

    launchFirework() {
        const color = new THREE.Color().setHSL(Math.random(), 1, 0.5);
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        const startX = (Math.random() - 0.5) * 5;
        const startY = (Math.random() - 0.5) * 5;

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = startX;
            positions[i * 3 + 1] = startY;
            positions[i * 3 + 2] = 0;

            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 0.1 + 0.05;

            velocities.push({
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed,
                z: (Math.random() - 0.5) * speed
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ color: color, size: 0.1, transparent: true });
        const firework = new THREE.Points(geometry, material);

        this.group.add(firework);
        this.fireworks.push({ mesh: firework, velocities, life: 1.0 });
    }

    setupUI() {
        const uiContent = `
            <div class="finale-container" style="text-align:center;">
                 <div class="love-card" style="background:white; color:black; padding:30px; border-radius:10px; max-width:400px; margin:auto; box-shadow:0 0 30px rgba(255,0,0,0.5);">
                    <h1 style="color:#ff4d6d; font-family:'Dancing Script';">Mano Jaan ❤️</h1>
                    <p>I’m deeply sorry and I love you.</p>
                    <p>You are my choice, not just a habit.</p>
                    <p>Please forgive me, cutie pie 🥹💕</p>
                    <h2 style="color:#ff4d6d;">Happy Valentine’s Day 🌹</h2>
                    <button id="send-love-btn">Send My Love 💌</button>
                 </div>
            </div>
        `;
        window.uiManager.createUI('finale', uiContent);

        setTimeout(() => {
            const btn = document.querySelector('#ui-finale #send-love-btn');
            if (btn) btn.addEventListener('click', () => {
                alert("Message Sent! ❤️ (Virtual Hug Dispatched)");
                // Maybe trigger huge firework
                for (let i = 0; i < 5; i++) setTimeout(() => this.launchFirework(), i * 200);
            });
        }, 100);
    }

    enter() {
        window.uiManager.showUI('finale');
        // Start firework loop
        this.fireworkInterval = setInterval(() => {
            this.launchFirework();
        }, 1000);
    }

    exit() {
        clearInterval(this.fireworkInterval);
    }

    update() {
        // Petals falling
        const positions = this.petals.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= 0.02;
            if (positions[i] < -5) positions[i] = 5;
        }
        this.petals.geometry.attributes.position.needsUpdate = true;

        // Update Fireworks
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const fw = this.fireworks[i];
            const fwPos = fw.mesh.geometry.attributes.position.array;

            for (let j = 0; j < fw.velocities.length; j++) {
                fwPos[j * 3] += fw.velocities[j].x;
                fwPos[j * 3 + 1] += fw.velocities[j].y;
                fwPos[j * 3 + 2] += fw.velocities[j].z;

                // Gravity
                fw.velocities[j].y -= 0.002;
            }

            fw.mesh.geometry.attributes.position.needsUpdate = true;
            fw.life -= 0.02;
            fw.mesh.material.opacity = fw.life;

            if (fw.life <= 0) {
                this.group.remove(fw.mesh);
                this.fireworks.splice(i, 1);
            }
        }
    }
}

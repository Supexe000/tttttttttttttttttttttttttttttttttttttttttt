
import * as THREE from 'three';
import gsap from 'gsap';
import { BaseScene } from './BaseScene.js';

export class PortalScene extends BaseScene {
    constructor(sceneManager) {
        super(sceneManager);
        this.particles = null;
        this.createHeartParticles();
        this.setupUI();
    }

    createHeartParticles() {
        const particleCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const color1 = new THREE.Color(0xff4d6d);
        const color2 = new THREE.Color(0xff8fa3);

        for (let i = 0; i < particleCount; i++) {
            // Heart shape formula
            const t = Math.random() * Math.PI * 2;
            // Distribute points inside the heart shape
            const r = Math.sqrt(Math.random());

            // Heart curve: x = 16sin^3(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

            // Scaled and randomized to fill volume
            const scale = 0.15;
            positions[i * 3] = x * scale * r + (Math.random() - 0.5) * 0.2;
            positions[i * 3 + 1] = y * scale * r + (Math.random() - 0.5) * 0.2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 1; // Depth

            // Color gradient
            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
        this.group.add(this.particles);
    }

    setupUI() {
        const uiContent = `
            <div class="portal-container">
                <h1 id="portal-text"></h1>
                <button id="enter-btn" class="hidden-btn">Enter My Heart 💖</button>
            </div>
            <style>
                .portal-container { text-align: center; }
                .hidden-btn { opacity: 0; pointer-events: none; transition: opacity 1s; }
                .visible-btn { opacity: 1; pointer-events: auto; }
            </style>
        `;
        window.uiManager.createUI('portal', uiContent);

        // Button Event
        setTimeout(() => {
            const btn = document.querySelector('#ui-portal #enter-btn');
            if (btn) btn.addEventListener('click', () => this.onEnterClick());
        }, 100);
    }

    onEnterClick() {
        // Zoom camera in
        gsap.to(this.sceneManager.camera.position, {
            z: 0,
            duration: 2,
            ease: "power2.in",
            onComplete: () => {
                this.sceneManager.switchScene('universe');
            }
        });

        // Expand heart
        gsap.to(this.particles.scale, {
            x: 5,
            y: 5,
            z: 5,
            duration: 2,
            ease: "power2.in"
        });

        // Fade out particles
        gsap.to(this.particles.material, {
            opacity: 0,
            duration: 1.5,
            delay: 0.5
        });
    }

    typeText() {
        const text = "Happy Valentine’s Day, Mano Jaan ❤️\nStep into my heart for a moment...";
        const element = document.querySelector('#ui-portal #portal-text');
        if (!element) return;

        element.innerHTML = "";
        let i = 0;
        const speed = 50;

        const type = () => {
            if (i < text.length) {
                if (text.charAt(i) === '\n') {
                    element.innerHTML += '<br>';
                } else {
                    element.innerHTML += text.charAt(i);
                }
                i++;
                setTimeout(type, speed);
            } else {
                // Show button after typing
                const btn = document.querySelector('#ui-portal #enter-btn');
                if (btn) btn.classList.add('visible-btn');
                btn.classList.remove('hidden-btn');
            }
        };
        type();
    }

    enter() {
        window.uiManager.showUI('portal');

        // Reset camera
        this.sceneManager.camera.position.set(0, 0, 5);
        this.sceneManager.camera.lookAt(0, 0, 0);

        // Reset particles
        this.particles.scale.set(1, 1, 1);
        this.particles.material.opacity = 0.8;

        // Start typing
        this.typeText();
    }

    update() {
        if (this.particles) {
            this.particles.rotation.y += 0.001;
            // Pulse effect
            const time = Date.now() * 0.001;
            this.particles.scale.x = 1 + Math.sin(time * 2) * 0.05;
            this.particles.scale.y = 1 + Math.sin(time * 2) * 0.05;
        }
    }
}

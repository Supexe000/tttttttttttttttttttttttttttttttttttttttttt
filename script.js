// Data
const welcomeMsg = "Happy Valentine’s Day Mano Jaan ❤️";
let typeIndex = 0;
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

// Audio
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicToggle');
let isMusicPlaying = false;

// Section 1: Typing Animation
function typeText() {
    const element = document.getElementById('welcomeText');
    if (typeIndex < welcomeMsg.length) {
        element.innerHTML += welcomeMsg.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeText, 100);
    }
}

// Global: Section Navigation
function nextSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    // Show target section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        
        // Trigger specific animations based on section
        if (sectionId === 'apology') {
            // Reset rain if revisiting? Optional
        }
    }
}

// Section 2: Clear Rain
function clearRain() {
    const rainContainer = document.getElementById('rainContainer');
    const content = document.getElementById('apologyContent');
    
    // Fade out rain
    rainContainer.style.opacity = '0';
    setTimeout(() => {
        rainContainer.style.display = 'none';
        content.classList.remove('hidden');
        content.classList.add('visible');
    }, 1000);
}

// Section 3: Heart Burst
function burstHeart() {
    const container = document.querySelector('.heart-container');
    const content = document.getElementById('heartText');
    
    // Create particles
    for (let i = 0; i < 20; i++) {
        createParticle(container);
    }
    
    // Show text
    content.classList.remove('hidden');
    content.classList.add('visible');
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random position relative to center
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    
    particle.style.transform = `translate(${x}px, ${y}px)`;
    particle.style.opacity = '1';
    
    // Animation
    particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
    ], {
        duration: 1000 + Math.random() * 500,
        easing: 'cubic-bezier(0, .9, .57, 1)',
        fill: 'forwards'
    });
    
    container.appendChild(particle);
    
    // Cleanup
    setTimeout(() => {
        particle.remove();
    }, 1500);
}

// Section 4: Carousel
function moveSlide(direction) {
    slides[currentSlide].classList.remove('active');
    
    currentSlide += direction;
    
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    slides[currentSlide].classList.add('active');
}

// Section 5: Final Button
function sendLove() {
    const btn = document.querySelector('.final-btn');
    btn.innerHTML = "Love Sent! 💖";
    btn.style.background = "#2ecc71";
    
    // Create massive heart explosion
    for(let i=0; i<50; i++) {
        createConfetti();
    }
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.innerHTML = Math.random() > 0.5 ? '❤️' : '✨';
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '100vh';
    confetti.style.fontSize = Math.random() * 20 + 20 + 'px';
    confetti.style.zIndex = '2000';
    
    document.body.appendChild(confetti);
    
    const duration = Math.random() * 3 + 2;
    
    confetti.animate([
        { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
        { transform: `translateY(-100vh) rotate(${Math.random()*360}deg)`, opacity: 0 }
    ], {
        duration: duration * 1000,
        easing: 'linear',
        fill: 'forwards'
    });
    
    setTimeout(() => confetti.remove(), duration * 1000);
}

// Initialization and Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Start typing
    setTimeout(typeText, 1000);
    
    // Music Toggle
    musicBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            music.pause();
            musicBtn.innerHTML = "🎵 Music Off";
            isMusicPlaying = false;
        } else {
            music.play().then(() => {
                musicBtn.innerHTML = "🎵 Music On";
                isMusicPlaying = true;
            }).catch(e => {
                console.log("Audio playback failed:", e);
                alert("Please interact with the document first to play audio!");
            });
        }
    });

    // Auto-play music if allowed (often blocked by browsers)
    // Optional: Try to play on first interaction
    document.body.addEventListener('click', () => {
        if (!isMusicPlaying) {
             music.play().then(() => {
                musicBtn.innerHTML = "🎵 Music On";
                isMusicPlaying = true;
            }).catch(e => {}); // Ignore error if already playing or failed
        }
    }, { once: true });
});

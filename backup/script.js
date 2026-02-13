// Audio Control
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
let isMusicPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.textContent = '🎵 Music Off';
    } else {
        bgMusic.play().catch(e => console.log('Playback prevented:', e));
        musicToggle.textContent = '🎵 Music On';
    }
    isMusicPlaying = !isMusicPlaying;
});

// Scene Management
function nextScene(sceneId) {
    // Hide current scene
    const currentScene = document.querySelector('.scene.active');
    currentScene.classList.remove('active');

    // Show next scene
    const nextScene = document.getElementById(`scene${sceneId}`);
    nextScene.classList.add('active');

    // Init scene specific animations
    if (sceneId === 1) initHearts();
    if (sceneId === 2) initRain();
}

// Scene 1: Floating Hearts (CSS handles most, but let's add dynamic ones)
function initHearts() {
    const container = document.querySelector('.floating-hearts-bg');
    for(let i=0; i<20; i++) {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 5 + 's';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        container.appendChild(heart);
    }
}

// Scene 2: Rain Logic
function initRain() {
    const container = document.getElementById('rain-container');
    container.innerHTML = ''; // Clear prev
    for(let i=0; i<50; i++) {
        const drop = document.createElement('div');
        drop.classList.add('rain-drop');
        drop.style.left = Math.random() * 100 + 'vw';
        drop.style.animationDuration = Math.random() * 0.5 + 0.5 + 's';
        drop.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(drop);
    }
}

function clearClouds() {
    const cloudOverlay = document.getElementById('cloud-overlay');
    const apologyText = document.getElementById('apology-text');
    const rainContainer = document.getElementById('rain-container');

    cloudOverlay.style.opacity = '0';
    setTimeout(() => {
        cloudOverlay.style.display = 'none';
        apologyText.classList.remove('hidden');
        apologyText.classList.add('visible');
        rainContainer.style.opacity = '0'; // Stop rain visual
    }, 1000);
}

// Scene 3: Beating Heart
let heartClicks = 0;
function beatHeart() {
    heartClicks++;
    const heart = document.querySelector('.heart');
    // Increase speed/size temp
    heart.style.animationDuration = (1.5 - (heartClicks * 0.2)) + 's';
    
    if (heartClicks >= 3) {
        document.getElementById('heart-message').classList.remove('hidden');
        document.getElementById('heart-message').classList.add('visible');
    }
}

// Scene 4: Carousel
let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active-slide'));
    slideIndex = (n + slides.length) % slides.length;
    slides[slideIndex].classList.add('active-slide');
}

function nextSlide() {
    showSlide(slideIndex + 1);
}

function prevSlide() {
    showSlide(slideIndex - 1);
}

// Scene 5: Checklist
function checkPromise() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    if (allChecked) {
        document.getElementById('promise-message').classList.remove('hidden');
        document.getElementById('promise-message').classList.add('visible');
    }
}

// Scene 6: Envelope
function openEnvelope() {
    const envelope = document.querySelector('.envelope');
    envelope.classList.add('open');
    
    setTimeout(() => {
        document.getElementById('final-btn').classList.remove('hidden');
        document.getElementById('final-btn').classList.add('visible');
        celebrate();
    }, 1000);
}

function celebrate() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ff8fa3', '#ffffff']
    });
}

// Init Scene 1 hearts on load
window.onload = function() {
    initHearts();
};

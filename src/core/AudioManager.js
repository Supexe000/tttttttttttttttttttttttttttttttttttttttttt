
export class AudioManager {
    constructor() {
        this.bgMusic = new Audio('https://www.bensound.com/bensound-music/bensound-cutedance.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.5;
        this.isMuted = false;

        this.setupUI();
    }

    setupUI() {
        const btn = document.createElement('button');
        btn.id = 'music-toggle';
        btn.innerText = '🎵 Music Off';
        btn.style.cssText = 'position:fixed; top:20px; right:20px; z-index:100; opacity: 0.8;';
        document.body.appendChild(btn);

        btn.addEventListener('click', () => this.toggleMusic());
    }

    toggleMusic() {
        if (this.bgMusic.paused) {
            this.bgMusic.play().catch(e => console.log("Audio play blocked", e));
            document.getElementById('music-toggle').innerText = '🎵 Music On';
        } else {
            this.bgMusic.pause();
            document.getElementById('music-toggle').innerText = '🎵 Music Off';
        }
    }

    // Can add playSoundEffect(url) here if needed
}

const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

// Total frames in sequence
const frameCount = 80;
const images = [];

// Base path for images
const basePath = 'Imgs/background/Create_a_dynamic_202602241327_qb72d_';

let loadedImages = 0;
let isLoaded = false;

// Format number to 3 digits
function pad(num) {
    return num.toString().padStart(3, '0');
}

// Preload images
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = `${basePath}${pad(i)}.jpg`;
    img.onload = () => {
        loadedImages++;
        if (loadedImages === frameCount) {
            isLoaded = true;
            resizeCanvas();
            requestAnimationFrame(update);
        }
    };
    images.push(img);
}

// Animation loop metrics
let currentFrame = 0;
let direction = 1; // 1 for forward, -1 for backward
const fps = 14; // Slower playback
const frameInterval = 1000 / fps;
let lastTime = 0;

// Handle resize and cover math
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (isLoaded && images[currentFrame]) {
        drawImageCover(ctx, images[currentFrame]);
    }
}

window.addEventListener('resize', resizeCanvas);

// Image cover polyfill logic for canvas
function drawImageCover(ctx, img) {
    const w = canvas.width;
    const h = canvas.height;

    // Scale to cover
    const scale = Math.max(w / img.width, h / img.height);
    const nw = img.width * scale;
    const nh = img.height * scale;

    // Center it
    const x = (w - nw) / 2;
    const y = (h - nh) / 2;

    ctx.drawImage(img, 0, 0, img.width, img.height, x, y, nw, nh);
}

function update(timestamp) {
    if (!isLoaded) return;

    if (!lastTime) lastTime = timestamp;
    const elapsed = timestamp - lastTime;

    if (elapsed > frameInterval) {
        currentFrame += direction;

        // Reverse direction at ends
        if (currentFrame >= frameCount - 1) {
            currentFrame = frameCount - 1;
            direction = -1;
        } else if (currentFrame <= 0) {
            currentFrame = 0;
            direction = 1;
        }

        lastTime = timestamp - (elapsed % frameInterval);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (images[currentFrame]) {
            drawImageCover(ctx, images[currentFrame]);
        }
    }

    requestAnimationFrame(update);
}

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');

mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
});

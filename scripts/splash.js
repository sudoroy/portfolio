// Splash screen functionality - Redesigned
document.addEventListener('DOMContentLoaded', () => {
  const splashScreen = document.querySelector('.splash-screen');
  const body = document.querySelector('body');
  
  // Create animated tagline
  createAnimatedTagline();
  
  // Create particles
  createParticles();
  
  // Animate progress bar
  animateProgressBar();
  
  // Hide splash screen after 5 seconds
  setTimeout(() => {
    splashScreen.classList.add('hidden');
    
    // After the transition completes, remove splash screen
    setTimeout(() => {
      splashScreen.style.display = 'none';
      body.classList.add('loaded');
      
      // Initialize main site
      initMainSite();
    }, 500);
  }, 5000);
});

// Create animated tagline with individual character spans
function createAnimatedTagline() {
  const tagline = document.querySelector('.splash-tagline');
  const text = tagline.textContent;
  
  // Clear the tagline
  tagline.textContent = '';
  
  // Add each character inside a span
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.textContent = text[i] === ' ' ? '\u00A0' : text[i]; // Use non-breaking space for spaces
    tagline.appendChild(span);
  }
}

// Create visually appealing particles
function createParticles() {
  const splashScreen = document.querySelector('.splash-screen');
  const numberOfParticles = 50;
  
  for (let i = 0; i < numberOfParticles; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random size
    const size = Math.random() * 15 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    
    // Random end position for floating animation
    const xEnd = (Math.random() - 0.5) * 200;
    const yEnd = -Math.random() * 200;
    particle.style.setProperty('--x-end', `${xEnd}px`);
    particle.style.setProperty('--y-end', `${yEnd}px`);
    
    // Random animation duration
    const duration = Math.random() * 3 + 2;
    particle.style.animation = `float-up ${duration}s infinite linear`;
    
    // Random delay
    const delay = Math.random() * 5;
    particle.style.animationDelay = `${delay}s`;
    
    // Random opacity
    const opacity = Math.random() * 0.5 + 0.3;
    particle.style.opacity = opacity;
    
    // Add to splash screen
    splashScreen.appendChild(particle);
  }
  
  // Add glitch effect elements
  const glitchContainer = document.createElement('div');
  glitchContainer.classList.add('splash-glitch');
  
  for (let i = 0; i < 2; i++) {
    const glitchItem = document.createElement('div');
    glitchItem.classList.add('splash-glitch-item');
    glitchContainer.appendChild(glitchItem);
  }
  
  splashScreen.appendChild(glitchContainer);
  
  // Add grid effect
  const grid = document.createElement('div');
  grid.classList.add('splash-grid');
  splashScreen.appendChild(grid);
}

// Animate progress bar with percentage counter
function animateProgressBar() {
  const progressBar = document.querySelector('.progress-bar');
  const percentage = document.querySelector('.percentage');
  let progress = 0;
  
  // Update every 50ms to create smooth animation
  const interval = setInterval(() => {
    progress += 1;
    progressBar.style.width = `${progress}%`;
    percentage.textContent = `${progress}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
    }
  }, 50);
}

// Initialize main site after splash screen
function initMainSite() {
  // Reveal the main content with staggered animations
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.classList.add('animated');
  }
  
  // Initialize glitch effect for titles
  const glitchTitles = document.querySelectorAll('.glitch-title');
  glitchTitles.forEach(title => {
    title.setAttribute('data-text', title.textContent);
  });
  
  // Initialize all scroll-triggered animations
  const animatedElements = document.querySelectorAll('.fade-in, .reveal');
  animatedElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('active');
    }, 200 * index);
  });
}
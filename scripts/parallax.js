// Parallax effect and smooth scrolling functionality - Redesigned
class ParallaxEffect {
  constructor() {
    // Elements that will have parallax effect
    this.parallaxElements = document.querySelectorAll('[data-parallax]');
    this.tiltElements = document.querySelectorAll('[data-tilt]');
    this.diagonalSections = document.querySelectorAll('.diagonal-section');
    this.init();
  }

  init() {
    // Initialize the parallax effect
    if (this.parallaxElements.length > 0) {
      window.addEventListener('scroll', this.scrollHandler.bind(this));
      window.addEventListener('resize', this.scrollHandler.bind(this));
      // Initial position
      this.scrollHandler();
    }
    
    // Initialize the tilt effect
    if (this.tiltElements.length > 0) {
      this.initTiltEffect();
    }
    
    // Initialize diagonal sections parallax
    if (this.diagonalSections.length > 0) {
      window.addEventListener('scroll', this.diagonalParallax.bind(this));
    }
    
    // Initialize smooth scrolling
    this.initSmoothScrolling();
  }

  scrollHandler() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    this.parallaxElements.forEach(element => {
      const speed = parseFloat(element.getAttribute('data-parallax')) || 0.1;
      const direction = element.getAttribute('data-direction') || 'up';
      const offset = element.getBoundingClientRect().top + scrollTop;
      const windowHeight = window.innerHeight;
      
      // Check if element is in viewport
      if (offset < scrollTop + windowHeight && offset + element.offsetHeight > scrollTop) {
        let yPos;
        
        if (direction === 'up') {
          // Moving up - standard parallax
          yPos = (scrollTop - offset) * speed;
          element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        } else if (direction === 'down') {
          // Moving down - reverse parallax
          yPos = (offset - scrollTop) * speed;
          element.style.transform = `translate3d(0, ${-yPos}px, 0)`;
        } else if (direction === 'left') {
          // Horizontal parallax to the left
          yPos = (scrollTop - offset) * speed;
          element.style.transform = `translate3d(${-yPos}px, 0, 0)`;
        } else if (direction === 'right') {
          // Horizontal parallax to the right
          yPos = (scrollTop - offset) * speed;
          element.style.transform = `translate3d(${yPos}px, 0, 0)`;
        } else if (direction === 'scale') {
          // Scale parallax
          const scale = 1 + ((scrollTop - offset) * speed * 0.001);
          element.style.transform = `scale(${Math.max(1, Math.min(scale, 1.5))})`;
        } else if (direction === 'opacity') {
          // Opacity parallax
          const opacity = 1 - ((scrollTop - offset) * speed * 0.001);
          element.style.opacity = Math.max(0.2, Math.min(opacity, 1));
        } else if (direction === 'rotate') {
          // Rotation parallax
          const rotation = (scrollTop - offset) * speed * 0.05;
          element.style.transform = `rotate(${rotation}deg)`;
        }
      }
    });
  }
  
  initTiltEffect() {
    this.tiltElements.forEach(element => {
      const maxTilt = parseFloat(element.getAttribute('data-tilt-max')) || 10;
      const perspective = parseFloat(element.getAttribute('data-tilt-perspective')) || 1000;
      const scale = parseFloat(element.getAttribute('data-tilt-scale')) || 1;
      const speed = parseFloat(element.getAttribute('data-tilt-speed')) || 400;
      
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element
        
        // Calculate rotation based on mouse position
        const rotateX = ((y / rect.height - 0.5) * maxTilt * -1).toFixed(2);
        const rotateY = ((x / rect.width - 0.5) * maxTilt).toFixed(2);
        
        // Apply transform
        element.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
        element.style.transition = `transform ${speed}ms ease-out`;
      });
      
      // Reset on mouse leave
      element.addEventListener('mouseleave', () => {
        element.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        element.style.transition = `transform ${speed}ms ease-out`;
      });
    });
  }
  
  diagonalParallax() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    this.diagonalSections.forEach(section => {
      const offset = section.getBoundingClientRect().top + scrollTop;
      const windowHeight = window.innerHeight;
      
      if (offset < scrollTop + windowHeight && offset + section.offsetHeight > scrollTop) {
        const progress = (scrollTop - offset + windowHeight) / (section.offsetHeight + windowHeight);
        const skewValue = 5 - (progress * 5); // Gradually reduce skew as you scroll
        
        // Limit skew between 0 and 5 degrees
        const limitedSkew = Math.max(0, Math.min(skewValue, 5));
        
        // Apply transform to the section
        section.style.transform = `skew(0deg, -${limitedSkew}deg)`;
        
        // Counter-skew the content to keep it straight
        const content = section.querySelector('div');
        if (content) {
          content.style.transform = `skew(0deg, ${limitedSkew}deg)`;
        }
      }
    });
  }

  initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (!targetElement) return;
        
        // Get target position
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        
        // Don't animate very small distances
        if (Math.abs(distance) < 50) {
          window.scrollTo(0, targetPosition);
          return;
        }
        
        let startTime = null;
        const duration = Math.min(1000, Math.max(500, Math.abs(distance) * 0.5)); // Adaptive duration
        
        function animation(currentTime) {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          
          // Custom easing function for smooth feel (cubic bezier approximation)
          const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
          
          window.scrollTo(0, startPosition + distance * easeOutQuart(progress));
          
          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          }
        }
        
        requestAnimationFrame(animation);
      });
    });
  }
}

// Initialize parallax effects when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize after a slight delay to ensure everything is loaded
  setTimeout(() => {
    new ParallaxEffect();
  }, 5100); // After splash screen
});
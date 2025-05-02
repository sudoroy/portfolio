// Main JavaScript file for Tanmay Roy's portfolio - Redesigned

document.addEventListener('DOMContentLoaded', () => {
  // Initialize custom cursor
  initCustomCursor();
  
  // Initialize navbar animations
  initNavbar();
  
  // Initialize scroll reveal animations
  initScrollReveal();
  
  // Initialize portfolio hover effects
  initPortfolioHover();
  
  // Initialize contact form
  initContactForm();
  
  // Initialize chat interface
  initChatInterface();
  
  // Add noise texture to page
  addNoiseTexture();
  
  // Add animated lines
  addAnimatedLines();
});

// Custom cursor
function initCustomCursor() {
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Add slight delay to follower
    setTimeout(() => {
      cursorFollower.style.left = e.clientX + 'px';
      cursorFollower.style.top = e.clientY + 'px';
    }, 50);
  });
  
  // Add effect on hover over links and buttons
  const links = document.querySelectorAll('a, button, .nav-icon, .portfolio-item, .social-link');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      cursor.style.backgroundColor = 'var(--accent-color-alt)';
      cursorFollower.style.width = '20px';
      cursorFollower.style.height = '20px';
    });
    
    link.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.backgroundColor = 'var(--accent-color)';
      cursorFollower.style.width = '40px';
      cursorFollower.style.height = '40px';
    });
  });
}

// Navbar animations and functionality
function initNavbar() {
  const header = document.querySelector('header');
  const navIcon = document.querySelector('.nav-icon');
  const body = document.body;
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Toggle navigation menu
  navIcon.addEventListener('click', () => {
    body.classList.toggle('nav-open');
  });
  
  // Close navigation when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      body.classList.remove('nav-open');
    });
  });
  
  // Add scroll effect to header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Add active class to nav link based on scroll position
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

// Scroll Reveal Animation
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Check initial state
}

// Portfolio hover effects and 3D tilt
function initPortfolioHover() {
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  portfolioItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      // Get position of mouse relative to item
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element
      
      // Calculate rotation based on mouse position (limited to +/- 10 degrees)
      const rotateX = ((y / rect.height - 0.5) * -20).toFixed(2);
      const rotateY = ((x / rect.width - 0.5) * 20).toFixed(2);
      
      // Apply transform with 3D effect
      item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Move content slightly to enhance 3D effect
      const content = item.querySelector('.portfolio-content');
      content.style.transform = `translateX(${rotateY / 2}px) translateY(${rotateX / 2}px)`;
    });
    
    // Reset transform when mouse leaves
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      
      const content = item.querySelector('.portfolio-content');
      content.style.transform = 'translateX(0) translateY(0)';
    });
  });
}

// Contact form functionality
function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple validation
      let valid = true;
      const inputs = contactForm.querySelectorAll('.form-control');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });
      
      // If form is valid, show success message
      if (valid) {
        // In a real implementation, you would submit the form to a server here
        const submitButton = contactForm.querySelector('.form-submit');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Simulate form submission
        setTimeout(() => {
          contactForm.innerHTML = `
            <div class="form-success">
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. I'll get back to you soon.</p>
            </div>
          `;
        }, 1500);
      }
    });
  }
}

// Chat interface functionality
function initChatInterface() {
  const chatButton = document.querySelector('.chat-button');
  const chatWindow = document.querySelector('.chat-window');
  const chatInput = document.querySelector('.chat-input input');
  const sendButton = document.querySelector('.send-button');
  const chatMessages = document.querySelector('.chat-messages');
  
  if (chatButton) {
    // Toggle chat window
    chatButton.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
      if (chatWindow.classList.contains('active')) {
        chatInput.focus();
      }
    });
    
    // Send message on button click
    sendButton.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    function sendMessage() {
      const message = chatInput.value.trim();
      
      if (message !== '') {
        // Add user message
        addMessage(message, 'sent');
        chatInput.value = '';
        
        // Simulate response after a delay
        setTimeout(() => {
          const responses = [
            "Thanks for your message! I'll get back to you soon.",
            "I appreciate you reaching out. Let's connect via email for a more detailed discussion.",
            "Great to hear from you! What specific project are you interested in?",
            "I'm currently available for new opportunities. Would you like to schedule a call?",
            "Thanks! I'll review your request and respond shortly."
          ];
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          addMessage(randomResponse, 'received');
          
          // Scroll to bottom
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
      }
    }
    
    function addMessage(text, type) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message', type);
      messageElement.innerHTML = `<div class="message-content">${text}</div>`;
      chatMessages.appendChild(messageElement);
      
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
}

// Add noise texture to the page for visual effect
function addNoiseTexture() {
  const noise = document.createElement('div');
  noise.classList.add('noise');
  document.body.appendChild(noise);
}

// Add animated vertical lines to the background
function addAnimatedLines() {
  const linesContainer = document.createElement('div');
  linesContainer.classList.add('lines');
  
  // Create 3 lines
  for (let i = 0; i < 3; i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    linesContainer.appendChild(line);
  }
  
  document.body.appendChild(linesContainer);
}

// Glitch effect for titles
function initGlitchEffect() {
  const glitchTitles = document.querySelectorAll('.glitch-title');
  
  glitchTitles.forEach(title => {
    title.setAttribute('data-text', title.textContent);
  });
}
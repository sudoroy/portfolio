document.addEventListener('DOMContentLoaded', function() {
    // Preloader with 5 seconds minimum display time
    // Initialize preloader display
    const preloader = document.querySelector('.preloader');
    if (!preloader) {
        console.error('Preloader element not found');
    }

    // Show preloader immediately during DOM content loaded
    if (preloader) {
        preloader.style.opacity = '1';
        preloader.style.display = 'flex';
    }

    // Handle formal preloader dismissal on window load
    window.addEventListener('load', function() {
        console.log('Window loaded, preloader active');
        // Record start time when window is fully loaded
        const startTime = new Date().getTime();
        const minDisplayTime = 5000; // 5 seconds minimum display time
        
        setTimeout(function() {
            if (!preloader) return;
            
            const currentTime = new Date().getTime();
            const elapsedTime = currentTime - startTime;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
            
            console.log('Preloader will dismiss in ' + remainingTime + 'ms');
            
            setTimeout(function() {
                preloader.style.opacity = '0';
                setTimeout(function() {
                    preloader.style.display = 'none';
                    console.log('Preloader dismissed');
                }, 500);
            }, remainingTime);
        }, 1000);
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close mobile menu when clicking on links
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Header scroll state
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active section highlighting in navigation
    const sections = document.querySelectorAll('section');
    
    function activateNavigation() {
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', activateNavigation);
    
    // Rotating professional titles in hero section
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const titles = ['WEB DEVELOPER', 'DATA ANALYST', 'CYBERSECURITY PROFESSIONAL'];
    let currentTitleIndex = 0;
    
    // Initial text setup
    heroSubtitle.innerHTML = '<span class="typing-title">' + titles[currentTitleIndex] + '</span>';
    
    function rotateTitles() {
        // Fade out
        const typingTitle = heroSubtitle.querySelector('.typing-title');
        typingTitle.style.opacity = '0';
        
        setTimeout(() => {
            // Update to next title
            currentTitleIndex = (currentTitleIndex + 1) % titles.length;
            
            // Display the single title with typing effect
            typingTitle.textContent = '';
            typingTitle.style.opacity = '1';
            
            // Type the text
            const textToType = titles[currentTitleIndex];
            let charIndex = 0;
            
            function typeChar() {
                if (charIndex < textToType.length) {
                    typingTitle.textContent += textToType.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeChar, 50); // Faster typing speed (changed from 100ms)
                }
            }
            
            typeChar();
        }, 500);
    }
    
    // Set longer rotation interval to ensure "CYBERSECURITY PROFESSIONAL" can fully type
    setInterval(rotateTitles, 5000);
    
    // Portfolio filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Form submission
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitMessage = document.getElementById('submit-message');
    const thankYouMessage = document.getElementById('thank-you-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Prevent the default form submission
            e.preventDefault();
            
            // Validate form
            let isValid = true;
            const formElements = contactForm.querySelectorAll('input, textarea');
            
            formElements.forEach(el => {
                if (!el.value.trim()) {
                    isValid = false;
                    el.classList.add('error');
                } else {
                    el.classList.remove('error');
                }
            });
            
            // If form is valid, show sending message and simulate submission
            if (isValid) {
                // Update UI to show sending state
                submitBtn.disabled = true;
                submitMessage.textContent = 'Sending message...';
                submitMessage.style.display = 'block';
                
                // Simulate form submission delay
                setTimeout(function() {
                    // Hide the form and show thank you message
                    contactForm.style.display = 'none';
                    thankYouMessage.style.display = 'block';
                    
                    // Send the form data to FormSubmit.co via fetch (silently in background)
                    const formData = new FormData(contactForm);
                    
                    fetch('https://formsubmit.co/sudodevroy@gmail.com', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    }).then(response => {
                        console.log('Form submitted successfully');
                    }).catch(error => {
                        console.error('Form submission error:', error);
                    });
                    
                    // Reset form for future use (but keep it hidden)
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitMessage.style.display = 'none';
                    
                    // Scroll to the thank you message
                    thankYouMessage.scrollIntoView({ behavior: 'smooth' });
                    
                }, 1500);
            }
        });
    }
});
/* ==========================================================================
   PlayFactory 360 Client Interaction Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // Sticky Header & Active Navigation Link
  // ==========================================
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Sticky Header toggle
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }

    // Scroll Spy active navigation highlight
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === currentSectionId) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // Mobile Hamburger Toggle
  // ==========================================
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (hamburgerToggle && navMenu) {
    hamburgerToggle.addEventListener('click', () => {
      hamburgerToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking navigation link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================
  // Scroll Reveal Observer
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once shown
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================
  // Animated Stats Counter
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(start + easeProgress * (target - start));

      // Formatting text
      if (target === 99) {
        element.textContent = `${currentValue}%`;
      } else if (target >= 1000) {
        // Display in K format
        const valueInK = (currentValue / 1000).toFixed(0);
        element.textContent = `${valueInK}K+`;
      } else {
        element.textContent = `${currentValue}+`;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Final format
        if (target === 99) {
          element.textContent = '99%';
        } else if (target === 10000) {
          element.textContent = '10K+';
        } else {
          element.textContent = `${target}+`;
        }
      }
    };

    requestAnimationFrame(animate);
  };

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(num => countUp(num));
      }
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // ==========================================
  // Featured Work / Services Infinite Marquee
  // ==========================================
  const sliderTrack = document.getElementById('slider-track');
  if (sliderTrack) {
    const cards = sliderTrack.querySelectorAll('.carousel-card');
    
    // Duplicate cards to enable a seamless infinite marquee loop
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      sliderTrack.appendChild(clone);
    });
    console.log("[PlayFactory 360 Marquee] Seamless loop cloned.");
  }

  // ==========================================
  // Portfolio Videos Loop Controller (8-second loops)
  // ==========================================
  const portfolioVideos = document.querySelectorAll('.portfolio-video');
  portfolioVideos.forEach(video => {
    video.addEventListener('timeupdate', () => {
      if (video.currentTime >= 8) {
        video.currentTime = 0;
      }
    });
    
    // Ensure muted ambient previews keep playing smoothly
    video.play().catch(err => {
      console.log('Ambient autoplay blocked/ignored:', err);
    });
  });

  // ==========================================
  // Portfolio Lightbox Modal (Dynamic Image/Video Switcher)
  // ==========================================
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const lightbox = document.getElementById('portfolio-lightbox');
  const lightboxImg = document.getElementById('lightbox-img-element');
  const lightboxVideo = document.getElementById('lightbox-video-element');
  const lightboxCaption = document.getElementById('lightbox-caption-element');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

  if (lightbox && lightboxCaption && lightboxCloseBtn) {
    
    portfolioItems.forEach(item => {
      item.addEventListener('click', () => {
        const imageSrc = item.getAttribute('data-image');
        const videoSrc = item.getAttribute('data-video');
        const captionText = item.getAttribute('data-caption');
        
        if (videoSrc) {
          // Play interactive video with controls & audio unmuted
          if (lightboxImg) lightboxImg.style.display = 'none';
          if (lightboxVideo) {
            lightboxVideo.style.display = 'block';
            lightboxVideo.src = videoSrc;
            lightboxVideo.muted = false; // play with sound!
            lightboxVideo.play().catch(err => console.log('Lightbox video play error:', err));
          }
        } else if (imageSrc) {
          // Display standard static image
          if (lightboxVideo) {
            lightboxVideo.style.display = 'none';
            lightboxVideo.pause();
            lightboxVideo.src = '';
          }
          if (lightboxImg) {
            lightboxImg.style.display = 'block';
            lightboxImg.src = imageSrc;
          }
        }
        
        lightboxCaption.textContent = captionText;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scroll
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Unlock scroll
      
      // Clear values after transition
      setTimeout(() => {
        if (lightboxImg) {
          lightboxImg.src = '';
          lightboxImg.style.display = 'none';
        }
        if (lightboxVideo) {
          lightboxVideo.pause();
          lightboxVideo.src = '';
          lightboxVideo.style.display = 'none';
        }
        lightboxCaption.textContent = '';
      }, 400);
    };

    lightboxCloseBtn.addEventListener('click', closeLightbox);
    
    // Close when clicking overlay backdrop
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ==========================================
  // Booking Form Submission & Confetti Celebration
  // ==========================================
  const bookingForm = document.getElementById('booking-inquiry-form');
  const successOverlay = document.getElementById('form-success');

  if (bookingForm && successOverlay) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show success screen with transition
      successOverlay.classList.add('active');

      // Launch micro-confetti particles inside the wrapper
      createFormConfetti(successOverlay);
      
      // Reset form fields
      bookingForm.reset();
    });
  }

  // Confetti Particle Generator
  const createFormConfetti = (container) => {
    const particleCount = 60;
    const colors = ['#f06e30', '#ffffff', '#ffd700', '#3b82f6'];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // Basic styling
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 8 + 6}px`;
      particle.style.height = `${Math.random() * 4 + 4}px`;
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = '2px';
      
      // Placed in center
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.zIndex = '5';
      
      container.appendChild(particle);
      
      // Velocity vectors
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 12 + 6;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 5; // upward bias
      
      let posX = 0;
      let posY = 0;
      let opacity = 1;
      let rotation = Math.random() * 360;
      const rotationSpeed = Math.random() * 10 - 5;
      
      const animateConfetti = () => {
        posX += vx;
        posY += vy + 0.3; // Gravity pull
        opacity -= 0.015;
        rotation += rotationSpeed;
        
        particle.style.transform = `translate3d(${posX}px, ${posY}px, 0px) rotate(${rotation}deg)`;
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
          requestAnimationFrame(animateConfetti);
        } else {
          particle.remove();
        }
      };
      
      requestAnimationFrame(animateConfetti);
    }
  };

  // Scroll to Next from Hero Mouse
  const scrollToNextBtn = document.getElementById('scroll-to-next');
  if (scrollToNextBtn) {
    scrollToNextBtn.addEventListener('click', () => {
      const nextSection = document.getElementById('stats');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initLoader();
  initNavigation();
  initTypedText();
  initSkillsTabs();
  initProjectsFilter();
  initProjectModals();
  initTestimonialSlider();
  initContactForm();
  initScrollAnimations();
  initCounters();
  initBackToTop();
  init3DBackground();
});

// Preloader
function initLoader() {
  const loader = document.querySelector('.loader');
  
  // Simulate loading time (remove in production and use actual asset loading)
  setTimeout(() => {
    loader.classList.add('loader-hidden');
    
    // Remove loader from DOM after transition
    loader.addEventListener('transitionend', () => {
      document.body.removeChild(loader);
    });
  }, 2000);
}

// Navigation
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Toggle mobile menu
  menuToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });
  
  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
    });
  });
  
  // Change navbar style on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });
  
  // Active link on scroll
  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
}

// Typed Text Animation
function initTypedText() {
  const options = {
    strings: [
      'responsive websites.',
      'interactive experiences.',
      'scalable applications.',
      'innovative solutions.'
    ],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    loop: true
  };
  
  if (document.getElementById('typed-text')) {
    new Typed('#typed-text', options);
  }
}

// Skills Tabs
function initSkillsTabs() {
  const categories = document.querySelectorAll('.skill-category');
  const skillGroups = document.querySelectorAll('.skills-group');
  
  if (categories.length === 0) return;
  
  categories.forEach(category => {
    category.addEventListener('click', () => {
      // Remove active class from all categories
      categories.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked category
      category.classList.add('active');
      
      // Hide all skill groups
      skillGroups.forEach(group => group.classList.remove('active'));
      
      // Show the corresponding skill group
      const targetGroup = document.getElementById(category.dataset.category);
      if (targetGroup) targetGroup.classList.add('active');
      
      // Animate skill bars
      animateSkillBars();
    });
  });
  
  // Initial animation of skill bars
  animateSkillBars();
}

// Animate skill bars
function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar');
  
  skillBars.forEach(bar => {
    const width = bar.dataset.width;
    bar.style.width = '0%';
    
    // Trigger reflow
    void bar.offsetWidth;
    
    // Animate to target width
    bar.style.width = `${width}%`;
  });
}

// Projects Filter and Carousel
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const carousel = document.getElementById('projects-carousel');
  const prevBtn = document.getElementById('prev-project');
  const nextBtn = document.getElementById('next-project');
  
  if (filterBtns.length === 0 || !carousel) return;
  
  // Calculate card width including gap
  const cardWidth = 400; // Width of a single card
  const gap = 32; // Gap between cards (2rem = 32px)
  const scrollAmount = cardWidth + gap; // Amount to scroll for each navigation
  const visibleCards = 2; // Number of cards visible at once
  
  // Function to update navigation buttons state
  const updateNavButtons = () => {
    // Disable prev button if at the beginning
    prevBtn.disabled = carousel.scrollLeft <= 10;
    prevBtn.classList.toggle('disabled', prevBtn.disabled);
    
    // Disable next button if at the end
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth - 10;
    nextBtn.disabled = carousel.scrollLeft >= maxScrollLeft;
    nextBtn.classList.toggle('disabled', nextBtn.disabled);
  };
  
  // Initial button state
  updateNavButtons();
  
  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      // Filter projects
      let visibleCount = 0;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
          visibleCount++;
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
      
      // Reset scroll position
      carousel.scrollLeft = 0;
      
      // Update navigation buttons after filtering
      setTimeout(updateNavButtons, 350);
    });
  });
  
  // Carousel navigation
  if (prevBtn && nextBtn) {
    // Previous button click
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setTimeout(updateNavButtons, 500);
    });
    
    // Next button click
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(updateNavButtons, 500);
    });
  }
  
  // Drag to scroll functionality
  let isDragging = false;
  let startX, scrollLeft;
  let dragThreshold = 5; // Minimum drag distance to trigger scroll
  let dragDistance = 0;
  
  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    carousel.classList.add('dragging');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    dragDistance = 0;
  });
  
  carousel.addEventListener('mouseleave', () => {
    if (isDragging) {
      snapToNearestCard();
    }
    isDragging = false;
    carousel.classList.remove('dragging');
  });
  
  carousel.addEventListener('mouseup', () => {
    if (isDragging) {
      snapToNearestCard();
    }
    isDragging = false;
    carousel.classList.remove('dragging');
  });
  
  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    dragDistance = Math.abs(walk);
    if (dragDistance > dragThreshold) {
      carousel.scrollLeft = scrollLeft - walk;
      updateNavButtons();
    }
  });
  
  // Touch events for mobile
  carousel.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    dragDistance = 0;
  });
  
  carousel.addEventListener('touchend', () => {
    if (isDragging) {
      snapToNearestCard();
    }
    isDragging = false;
  });
  
  carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    dragDistance = Math.abs(walk);
    if (dragDistance > dragThreshold) {
      carousel.scrollLeft = scrollLeft - walk;
      updateNavButtons();
    }
  });
  
  // Function to snap to nearest card after dragging
  function snapToNearestCard() {
    const cardWidth = 400;
    const cardGap = 32;
    const totalCardWidth = cardWidth + cardGap;
    
    // Calculate which card is closest
    const cardIndex = Math.round(carousel.scrollLeft / totalCardWidth);
    const targetPosition = cardIndex * totalCardWidth;
    
    // Smooth scroll to the target position
    carousel.scrollTo({
      left: targetPosition,
      behavior: 'smooth'
    });
    setTimeout(updateNavButtons, 300);
  }
  
  // Listen for scroll events to update button states
  carousel.addEventListener('scroll', () => {
    updateNavButtons();
  });
}

// Project Modals
function initProjectModals() {
  const viewButtons = document.querySelectorAll('.view-project');
  const modal = document.querySelector('.project-modal');
  const modalClose = document.querySelector('.modal-close');
  const modalBody = document.querySelector('.modal-body');
  
  if (!modal) return;
  
  // Project details data
  const projectDetails = {
    'music-hub': {
      title: 'Music Hub',
      category: 'Web Application',
      client: 'StreamTunes Inc.',
      date: 'January 2023',
      description: 'A modern music streaming platform with social features, allowing users to discover, share, and create playlists. Built with React, Node.js, and MongoDB, featuring real-time updates and a recommendation engine.',
      features: [
        'User authentication and profiles',
        'Music discovery and recommendations',
        'Playlist creation and sharing',
        'Social interaction between users',
        'Real-time notifications'
      ],
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'WebSockets', 'AWS S3'],
      image: 'images/musichub.png'
    },
    'romeo-game': {
      title: 'Romeo Game',
      category: 'Interactive Game',
      client: 'GameVerse Studios',
      date: 'October 2022',
      description: 'An immersive browser-based game with stunning visuals and engaging gameplay. Developed using vanilla JavaScript and Canvas API, with WebGL for advanced rendering effects.',
      features: [
        'Multiple game levels and challenges',
        'Character customization',
        'Real-time multiplayer functionality',
        'Leaderboards and achievements',
        'Cross-device compatibility'
      ],
      technologies: ['JavaScript', 'HTML5 Canvas', 'WebGL', 'Socket.io', 'LocalStorage API'],
      image: 'images/romeogame.png'
    },
    'planets': {
      title: '3D Planets Explorer',
      category: 'Interactive Visualization',
      client: 'EduSpace Learning',
      date: 'March 2023',
      description: 'An educational 3D visualization tool that allows users to explore the solar system with accurate scale models and information. Built with Three.js for immersive 3D rendering.',
      features: [
        'Interactive 3D planet models',
        'Realistic textures and lighting',
        'Educational information panels',
        'Orbit visualization',
        'Camera controls for exploration'
      ],
      technologies: ['Three.js', 'WebGL', 'GSAP', 'JavaScript', 'HTML5', 'CSS3'],
      image: 'images/planets.png'
    },
    'call-of-duty': {
      title: 'Call of Duty Portal',
      category: 'Gaming Community Platform',
      client: 'GamersUnite Network',
      date: 'August 2022',
      description: 'A community platform for Call of Duty players to connect, form teams, and organize tournaments. Features real-time chat, event scheduling, and integration with game statistics APIs.',
      features: [
        'User profiles with game statistics',
        'Team formation and management',
        'Tournament organization tools',
        'Real-time chat and notifications',
        'Game statistics integration'
      ],
      technologies: ['Vue.js', 'Firebase', 'Firestore', 'WebSockets', 'REST APIs'],
      image: 'images/callofduty.png'
    }
  };
  
  // Open modal with project details
  viewButtons.forEach(button => {
    button.addEventListener('click', () => {
      const projectId = button.dataset.project;
      const project = projectDetails[projectId];
      
      if (project) {
        // Create modal content
        modalBody.innerHTML = `
          <div class="modal-project">
            <div class="modal-project-image">
              <img src="${project.image}" alt="${project.title}" />
            </div>
            <div class="modal-project-info">
              <h2>${project.title}</h2>
              <div class="modal-project-meta">
                <div class="meta-item">
                  <span class="meta-label">Category:</span>
                  <span class="meta-value">${project.category}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Client:</span>
                  <span class="meta-value">${project.client}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Date:</span>
                  <span class="meta-value">${project.date}</span>
                </div>
              </div>
              <div class="modal-project-description">
                <h3>Project Overview</h3>
                <p>${project.description}</p>
              </div>
              <div class="modal-project-features">
                <h3>Key Features</h3>
                <ul>
                  ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
              </div>
              <div class="modal-project-tech">
                <h3>Technologies Used</h3>
                <div class="tech-tags">
                  ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
              </div>
              <div class="modal-project-actions">
                <a href="#" class="btn btn-primary">Live Demo</a>
                <a href="#" class="btn btn-secondary">Source Code</a>
              </div>
            </div>
          </div>
        `;
        
        // Show modal
        modal.classList.add('modal-active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // Close modal
  modalClose.addEventListener('click', () => {
    modal.classList.remove('modal-active');
    document.body.style.overflow = 'auto';
  });
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('modal-active');
      document.body.style.overflow = 'auto';
    }
  });
}

// Testimonial Slider
function initTestimonialSlider() {
  const testimonials = document.querySelectorAll('.testimonial-item');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  let currentIndex = 0;
  
  if (testimonials.length === 0) return;
  
  // Show testimonial at index
  function showTestimonial(index) {
    testimonials.forEach(item => item.classList.remove('active'));
    testimonials[index].classList.add('active');
  }
  
  // Previous testimonial
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentIndex);
  });
  
  // Next testimonial
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
  });
  
  // Auto-rotate testimonials
  setInterval(() => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
  }, 5000);
}

// Contact Form
function initContactForm() {
  const form = document.getElementById('contact-form');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Validate form (simple validation)
    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields');
      return;
    }
    
    // Simulate form submission (replace with actual form submission)
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      // Reset form
      form.reset();
      
      // Show success message
      submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
      
      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
        submitBtn.disabled = false;
      }, 3000);
    }, 2000);
  });
}

// AOS Scroll Animations
function initScrollAnimations() {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
}

// Counter Animation
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  if (counters.length === 0) return;
  
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.count);
        let count = 0;
        const duration = 2000; // ms
        const increment = Math.ceil(target / (duration / 16)); // 60fps
        
        const updateCount = () => {
          count += increment;
          if (count < target) {
            counter.textContent = count;
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = target;
          }
        };
        
        requestAnimationFrame(updateCount);
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

// Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (!backToTopBtn) return;
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  });
  
  // Scroll to top when clicked
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 3D Background with Three.js
function init3DBackground() {
  // Check if Three.js is loaded
  if (typeof THREE === 'undefined') return;
  
  // Create scene
  const scene = new THREE.Scene();
  
  // Create camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0); // Transparent background
  
  // Append renderer to DOM
  const container = document.createElement('div');
  container.classList.add('background-canvas');
  document.body.insertBefore(container, document.body.firstChild);
  container.appendChild(renderer.domElement);
  
  // Create particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1500;
  
  const posArray = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  // Create material
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0x5e35b1,
    transparent: true,
    opacity: 0.8
  });
  
  // Create mesh
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);
  
  // Mouse movement effect
  let mouseX = 0;
  let mouseY = 0;
  
  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
  }
  
  document.addEventListener('mousemove', onDocumentMouseMove);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    particlesMesh.rotation.x += 0.0005;
    particlesMesh.rotation.y += 0.0005;
    
    // Respond to mouse movement
    particlesMesh.rotation.x += mouseY * 0.0005;
    particlesMesh.rotation.y += mouseX * 0.0005;
    
    renderer.render(scene, camera);
  }
  
  animate();
}

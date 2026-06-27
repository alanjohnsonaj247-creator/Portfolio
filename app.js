document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // MOBILE NAVIGATION MENU
  // ==========================================================================
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const menuLines = {
    line1: document.getElementById('menu-line-1'),
    line2: document.getElementById('menu-line-2'),
    line3: document.getElementById('menu-line-3')
  };

  const toggleMenu = () => {
    const isOpen = mainNav.classList.toggle('open');
    mobileNavToggle.setAttribute('aria-expanded', isOpen);
    
    // Animate hamburger lines
    if (isOpen) {
      menuLines.line1.setAttribute('transform', 'rotate(45 12 12)');
      menuLines.line1.setAttribute('x1', '4');
      menuLines.line1.setAttribute('y1', '12');
      menuLines.line1.setAttribute('x2', '20');
      menuLines.line1.setAttribute('y2', '12');
      
      menuLines.line2.setAttribute('opacity', '0');
      
      menuLines.line3.setAttribute('transform', 'rotate(-45 12 12)');
      menuLines.line3.setAttribute('x1', '4');
      menuLines.line3.setAttribute('y1', '12');
      menuLines.line3.setAttribute('x2', '20');
      menuLines.line3.setAttribute('y2', '12');
    } else {
      menuLines.line1.removeAttribute('transform');
      menuLines.line1.setAttribute('x1', '4');
      menuLines.line1.setAttribute('y1', '6');
      menuLines.line1.setAttribute('x2', '20');
      menuLines.line1.setAttribute('y2', '6');
      
      menuLines.line2.removeAttribute('opacity');
      
      menuLines.line3.removeAttribute('transform');
      menuLines.line3.setAttribute('x1', '4');
      menuLines.line3.setAttribute('y1', '18');
      menuLines.line3.setAttribute('x2', '20');
      menuLines.line3.setAttribute('y2', '18');
    }
  };

  mobileNavToggle.addEventListener('click', toggleMenu);

  // Close mobile menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('open')) {
        toggleMenu();
      }
    });
  });


  // ==========================================================================
  // ACTIVE NAVIGATION LINK OBSERVER
  // ==========================================================================
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Matches when section is in the middle of viewport
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));


  // ==========================================================================
  // HEADER SCROLL STATE EFFECT
  // ==========================================================================
  const header = document.querySelector('.site-header');
  const checkScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Run once initially


  // ==========================================================================
  // CONTACT FORM VALIDATION & HANDLING
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const feedbackContainer = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('form-submit-btn');

  // Input elements
  const inputs = {
    name: document.getElementById('form-name'),
    email: document.getElementById('form-email'),
    subject: document.getElementById('form-subject'),
    message: document.getElementById('form-message')
  };

  // Error span elements
  const errorSpans = {
    name: document.getElementById('name-error'),
    email: document.getElementById('email-error'),
    subject: document.getElementById('subject-error'),
    message: document.getElementById('message-error')
  };

  // Clear single validation error
  const clearError = (field) => {
    errorSpans[field].textContent = '';
    inputs[field].style.borderColor = '';
  };

  // Show validation error
  const showError = (field, message) => {
    errorSpans[field].textContent = message;
    inputs[field].style.borderColor = '#EF4444'; // Red outline for errors
  };

  // Live validation on inputs
  Object.keys(inputs).forEach(key => {
    inputs[key].addEventListener('input', () => {
      clearError(key);
      feedbackContainer.textContent = '';
    });
  });

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    feedbackContainer.textContent = '';
    let isValid = true;

    // Name Validation
    if (!inputs.name.value.trim()) {
      showError('name', 'Name is required.');
      isValid = false;
    } else if (inputs.name.value.trim().length < 2) {
      showError('name', 'Name must be at least 2 characters.');
      isValid = false;
    }

    // Email Validation
    if (!inputs.email.value.trim()) {
      showError('email', 'Email is required.');
      isValid = false;
    } else if (!validateEmail(inputs.email.value.trim())) {
      showError('email', 'Please enter a valid email address.');
      isValid = false;
    }

    // Subject Validation
    if (!inputs.subject.value.trim()) {
      showError('subject', 'Subject is required.');
      isValid = false;
    } else if (inputs.subject.value.trim().length < 4) {
      showError('subject', 'Subject must be at least 4 characters.');
      isValid = false;
    }

    // Message Validation
    if (!inputs.message.value.trim()) {
      showError('message', 'Message is required.');
      isValid = false;
    } else if (inputs.message.value.trim().length < 15) {
      showError('message', 'Message must be at least 15 characters.');
      isValid = false;
    }

    // If validations pass, show sending and then success state
    if (isValid) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';
      feedbackContainer.className = 'form-feedback';
      feedbackContainer.textContent = '';

      // Simulate network request
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        
        // Show success state
        feedbackContainer.className = 'form-feedback success';
        feedbackContainer.textContent = 'Thank you. Your message has been sent successfully.';
        
        // Reset form inputs
        contactForm.reset();
        
        // Clear message after 5 seconds
        setTimeout(() => {
          feedbackContainer.textContent = '';
        }, 5000);
      }, 1200);
    }
  });

});

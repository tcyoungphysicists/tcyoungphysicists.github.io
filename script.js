document.addEventListener('DOMContentLoaded', () => {
    console.log('Welcome to Tri-Chandra Young Physicists (TCYP)!');

    // Mobile menu functionality
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('nav ul');
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    // Enhanced Mobile menu toggle with accessibility
    const toggleMobileMenu = (open) => {
        mobileMenuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        navMenu.classList.add('transitioning');
        
        if (open) {
            navMenu.classList.add('active');
            document.body.classList.add('menu-open');
        } else {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
        
        // Remove transition class after animation
        setTimeout(() => {
            navMenu.classList.remove('transitioning');
        }, 300);
    };

    // Mobile menu button click handler
    mobileMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navMenu.classList.contains('active');
        toggleMobileMenu(!isOpen);
        mobileMenuButton.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && 
            !e.target.closest('.mobile-menu-button') && 
            navMenu.classList.contains('active')) {
            toggleMobileMenu(false);
            mobileMenuButton.classList.remove('active');
        }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMobileMenu(false);
            mobileMenuButton.classList.remove('active');
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                toggleMobileMenu(false);
                mobileMenuButton.classList.remove('active');
            }
        }, 250);
    });

    // Close menu when clicking on a nav link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu(false);
                mobileMenuButton.classList.remove('active');
            }
        });
    });

    // Header scroll behavior
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow and background to header when scrolled
        if (currentScroll > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }

        // Hide header when scrolling down, show when scrolling up
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Set current page in navigation
    const setCurrentPage = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('nav ul li a').forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
               (currentPage === 'index.html' && linkHref === './') || 
               (currentPage === 'index.html' && linkHref === '#home')) {
                link.classList.add('current-page');
            }
        });
    };
    
    setCurrentPage();

    // Smooth scroll for in-page links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu(false);
                mobileMenuButton.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form validation for join page
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
        joinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const emailInput = document.getElementById('email');
            const nameInput = document.getElementById('name');
            
            // Simple email validation
            if (emailInput) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    showError(emailInput, 'Please enter a valid email address');
                    isValid = false;
                } else {
                    removeError(emailInput);
                }
            }
            
            // Name validation
            if (nameInput && nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required');
                isValid = false;
            } else if (nameInput) {
                removeError(nameInput);
            }
            
            if (isValid) {
                // Form is valid, show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for your interest! We will contact you soon.';
                
                joinForm.innerHTML = '';
                joinForm.appendChild(successMessage);
            }
        });
    }

    function showError(input, message) {
        const formControl = input.parentElement;
        const errorMessage = formControl.querySelector('.error-message') || document.createElement('div');
        
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        if (!formControl.querySelector('.error-message')) {
            formControl.appendChild(errorMessage);
        }
        
        formControl.className = 'form-control error';
    }

    function removeError(input) {
        const formControl = input.parentElement;
        const errorMessage = formControl.querySelector('.error-message');
        
        if (errorMessage) {
            formControl.removeChild(errorMessage);
        }
        
        formControl.className = 'form-control';
    }

    // Animation for elements when they come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Animate elements with fade-in-up class
    document.querySelectorAll('.fade-in-up').forEach(element => {
        observer.observe(element);
    });

    // Handle back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Form validation and error handling
    const validateForm = (form) => {
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        const errors = [];

        inputs.forEach(input => {
            removeError(input);

            if (input.hasAttribute('required') && !input.value.trim()) {
                showError(input, `${input.getAttribute('placeholder') || input.name} is required`);
                isValid = false;
                errors.push(`${input.getAttribute('placeholder') || input.name} is required`);
            }

            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    showError(input, 'Please enter a valid email address');
                    isValid = false;
                    errors.push('Invalid email format');
                }
            }

            if (input.type === 'tel' && input.value) {
                const phoneRegex = /^\+?\d{10,}$/;
                if (!phoneRegex.test(input.value.replace(/[\s-]/g, ''))) {
                    showError(input, 'Please enter a valid phone number');
                    isValid = false;
                    errors.push('Invalid phone number format');
                }
            }
        });

        return { isValid, errors };
    };

    // Enhanced form submission with loading state and error handling
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;

        // Validate form
        const { isValid, errors } = validateForm(form);
        if (!isValid) {
            // Show first error in alert for accessibility
            alert(errors[0]);
            return;
        }

        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Thank you for your submission! We will get back to you soon.</p>
            `;

            form.innerHTML = '';
            form.appendChild(successMessage);

        } catch (error) {
            console.error('Form submission error:', error);
            alert('An error occurred. Please try again later.');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    };

    // Image loading and error handling
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'logo.png'; // Fallback image
            this.alt = 'Image not available';
            this.classList.add('img-error');
        });

        // Add loading state
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        }
    });

    // Handle network status
    window.addEventListener('online', () => {
        document.body.classList.remove('offline');
    });

    window.addEventListener('offline', () => {
        document.body.classList.add('offline');
        alert('You are currently offline. Some features may be limited.');
    });

    // Attach form handlers
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
});
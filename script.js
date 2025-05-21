document.addEventListener('DOMContentLoaded', () => {

    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinksMobile = mobileMenu ? mobileMenu.querySelectorAll('a[href^="#"]') : [];

    if (menuBtn && closeBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('closed');
            mobileMenu.classList.add('open');
        });

        closeBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            mobileMenu.classList.add('closed');
        });

        navLinksMobile.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileMenu.classList.add('closed');
            });
        });
    } else {
        console.error("Mobile menu elements not found");
    }


    // Dark mode toggle
    const toggle = document.getElementById('toggle');
    const html = document.documentElement;

    const applyTheme = () => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            html.classList.add('dark');
            if(toggle) toggle.checked = true;
            document.body.classList.add('dark');
            document.body.classList.remove('light');
        } else {
            html.classList.remove('dark');
             if(toggle) toggle.checked = false;
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        }
    };

    if (toggle) {
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                localStorage.theme = 'dark';
            } else {
                localStorage.theme = 'light';
            }
            applyTheme();
        });
    } else {
        console.error("Dark mode toggle not found");
    }
    applyTheme();


    // Dynamic text typing effect
    const dynamicTextElement = document.getElementById('dynamic-text');
    if (dynamicTextElement) {
        const texts = [
            "Social Media Marketer",
            "Web Developer",
            "Full-Stack Enthusiast",
            "React Developer",
            "Digital Problem Solver"
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 100;
        const deletingSpeed = 50;
        const pauseEnd = 1500;
        const pauseStart = 500;

        function typeText() {
            const currentText = texts[textIndex];
            let typeDelay;
            const electricColor = getComputedStyle(document.documentElement).getPropertyValue('--electric') || '#00FFFF';
            dynamicTextElement.style.borderRight = `2px solid ${electricColor.trim()}`;

            if (isDeleting) {
                dynamicTextElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typeDelay = deletingSpeed;
            } else {
                dynamicTextElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typeDelay = typingSpeed;
            }
            dynamicTextElement.style.animation = 'none';
             void dynamicTextElement.offsetWidth;
            dynamicTextElement.style.animation = `blink-caret .75s step-end infinite`;

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typeDelay = pauseEnd;
                dynamicTextElement.style.animation = `blink-caret .75s step-end infinite`;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeDelay = pauseStart;
            }
            setTimeout(typeText, typeDelay);
        }
        setTimeout(typeText, 1000);
    } else {
        console.error("Dynamic text element not found");
    }


    // ========================================================================
    // === NEW GOOGLE SHEETS CONTACT FORM SUBMISSION LOGIC STARTS HERE ===
    // ========================================================================
    const contactForm = document.getElementById('contact-form');
    const formResponseMessageDiv = document.getElementById('form-response-message');
    const submitButton = document.getElementById('contactSubmitButton');

    // ####################################################################
    // ### PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL EXACTLY AS COPIED  ###
    // ### FROM THE DEPLOYMENT DIALOG.                                  ###
    // ### Example: 'https://script.google.com/macros/s/ABC123xyz.../exec' ###
    // ####################################################################
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx4oeKHg_fCs8TEgYhTiPcNV_yPL9BeEEbeyfj-jqfiweksoVlK0TUn8180_F2ayWAW/exec';

    if (contactForm && formResponseMessageDiv && submitButton) {
        if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_GOES_HERE' || GOOGLE_SCRIPT_URL === '') {
            console.error("❌ Google Apps Script URL is not set in script.js. Form will not submit to Google Sheets.");
            if(formResponseMessageDiv) {
                formResponseMessageDiv.textContent = 'Form submission is not configured. Please contact the site administrator.';
                formResponseMessageDiv.className = 'mt-6 text-center text-red-500';
            }
        }

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_GOES_HERE' || GOOGLE_SCRIPT_URL === '') {
                if(formResponseMessageDiv) {
                    formResponseMessageDiv.textContent = 'Form submission is currently disabled.';
                    formResponseMessageDiv.className = 'mt-6 text-center text-red-500';
                }
                return; // Stop if URL is not set
            }

            const nameField = contactForm.querySelector('[name="name"]');
            const emailField = contactForm.querySelector('[name="email"]');
            const messageField = contactForm.querySelector('[name="message"]');
            let isValid = true;
            let errorMessages = [];

            formResponseMessageDiv.textContent = '';
            formResponseMessageDiv.className = 'mt-6 text-center';

            if (!nameField.value.trim()) {
                isValid = false;
                errorMessages.push('Name is required.');
            }
            if (!emailField.value.trim()) {
                isValid = false;
                errorMessages.push('Email is required.');
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value.trim())) {
                    isValid = false;
                    errorMessages.push('Please enter a valid email address.');
                }
            }
            if (!messageField.value.trim()) {
                isValid = false;
                errorMessages.push('Message is required.');
            }

            if (!isValid) {
                formResponseMessageDiv.innerHTML = errorMessages.join('<br>');
                formResponseMessageDiv.classList.add('text-red-500');
                return;
            }

            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin ml-2"></i>';

            formResponseMessageDiv.textContent = 'Processing your request...';
            formResponseMessageDiv.classList.add('text-gray-400');

            const formData = new FormData(contactForm);

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Google Apps Script Response:', data);
                if (data.result === 'success') {
                    formResponseMessageDiv.textContent = 'Message sent successfully! Thank you.';
                    formResponseMessageDiv.className = 'mt-6 text-center text-neon';
                    contactForm.reset();
                } else {
                    formResponseMessageDiv.textContent = 'Submission failed: ' + (data.message || 'Unknown server error.');
                    formResponseMessageDiv.className = 'mt-6 text-center text-red-500';
                    console.error('Apps Script Error:', data.message, data.errorDetails);
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                formResponseMessageDiv.textContent = 'An error occurred. Please try again. (' + error.message + ')';
                formResponseMessageDiv.className = 'mt-6 text-center text-red-500';
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            });
        });
    } else {
        if (!contactForm) console.warn('Contact form (#contact-form) not found.');
        if (!formResponseMessageDiv) console.warn('Form response message div (#form-response-message) not found.');
        if (!submitButton) console.warn('Contact submit button (#contactSubmitButton) not found.');
        console.warn('Google Sheets contact form integration might not be fully active.');
    }
    // ========================================================================
    // === NEW GOOGLE SHEETS CONTACT FORM SUBMISSION LOGIC ENDS HERE ===
    // ========================================================================


    // Create simple particles for background
    function createParticles() {
        const container = document.getElementById('particles-container');
        if (!container) {
            return;
        }
        container.innerHTML = '';
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 2 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            const duration = Math.random() * 10 + 5;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${Math.random() * duration}s`;
            container.appendChild(particle);
        }
    }
    createParticles();


    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1 && href.startsWith('#')) {
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const offsetTop = targetElement.offsetTop;
                    const navHeight = document.querySelector('nav')?.offsetHeight || 64;
                    window.scrollTo({
                        top: offsetTop - navHeight - 10,
                        behavior: 'smooth'
                    });
                    if (mobileMenu && mobileMenu.contains(this) && mobileMenu.classList.contains('open')) {
                         mobileMenu.classList.remove('open');
                         mobileMenu.classList.add('closed');
                    }
                }
            }
        });
    });


    // Animate elements on scroll (Intersection Observer)
    const animatedElements = document.querySelectorAll('.neon-border, .project-card, .skill-progress');
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.style.opacity = '1';
                     if (element.classList.contains('project-card') || element.classList.contains('neon-border')) {
                         element.style.transform = 'translateY(0)';
                     }
                    if (element.classList.contains('skill-progress')) {
                        const targetWidthMatch = element.getAttribute('style')?.match(/width:\s*([\d.]+)%/);
                        if (targetWidthMatch && targetWidthMatch[1]) {
                            element.style.width = `${targetWidthMatch[1]}%`;
                        } else {
                             console.warn('Could not parse width for skill bar:', element);
                        }
                    }
                    observer.unobserve(element);
                }
            });
        }, { root: null, threshold: 0.1 });
        animatedElements.forEach(el => { observer.observe(el); });
    } else {
        console.warn("IntersectionObserver not supported, using scroll event fallback for animations.");
        function animateOnScrollFallback() {
            animatedElements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                if (elementPosition < screenPosition && element.style.opacity !== '1') {
                    element.style.opacity = '1';
                     if (element.classList.contains('project-card') || element.classList.contains('neon-border')) {
                         element.style.transform = 'translateY(0)';
                     }
                    if (element.classList.contains('skill-progress')) {
                         const targetWidthMatch = element.getAttribute('style')?.match(/width:\s*([\d.]+)%/);
                         if (targetWidthMatch && targetWidthMatch[1]) {
                            setTimeout(() => { element.style.width = `${targetWidthMatch[1]}%`; }, 50);
                         } else {
                             console.warn('Fallback: Could not parse width for skill bar:', element);
                         }
                    }
                }
            });
        }
        window.addEventListener('scroll', animateOnScrollFallback);
        setTimeout(animateOnScrollFallback, 100);
    }

}); // End DOMContentLoaded
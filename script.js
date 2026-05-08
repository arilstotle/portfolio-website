document.addEventListener('DOMContentLoaded', () => {
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item, .contact-btn');
    const pageViews = document.querySelectorAll('.page-view');
    const brand = document.querySelector('.nav-brand');

    // Function to switch views
    function switchView(targetId, clickedItem = null) {
        const targetView = document.getElementById(targetId);
        const isAlreadyActive = targetView && targetView.classList.contains('active-view');

        // Remove active class from all views
        pageViews.forEach(view => {
            view.classList.remove('active-view');
        });

        // Add active class to target view
        if (targetView) {
            targetView.classList.add('active-view');
            // Only scroll to top if we are switching to a DIFFERENT view
            if (!isAlreadyActive && !clickedItem?.getAttribute('data-scroll')) {
                window.scrollTo(0, 0);
            }
        }

        // Toggle progress bar visibility
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
            if (targetId === 'home') {
                progressContainer.style.display = 'block';
            } else {
                progressContainer.style.display = 'none';
            }
        }
    }

    // Attach click event listeners to navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            if (targetId) {
                switchView(targetId, item);
                
                // Handle scrolling to a specific section within the view
                const scrollTarget = item.getAttribute('data-scroll');
                if (scrollTarget) {
                    setTimeout(() => {
                        const el = document.getElementById(scrollTarget);
                        if (el) {
                            // Adjust for navbar height
                            const y = el.getBoundingClientRect().top + window.scrollY - 80;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                    }, 50);
                }
            }
        });
    });

    // Brand click returns to home and scrolls to top
    brand.addEventListener('click', () => {
        switchView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Navbar scroll effect and Progress Bar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        // Navbar styling
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.5)';
            navbar.style.height = '70px';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.height = 'var(--nav-height)';
        }

        // Progress bar logic (only on home view)
        const homeView = document.getElementById('home');
        const myBar = document.getElementById("myBar");
        const progressContainer = document.querySelector('.progress-container');
        
        if (myBar && progressContainer) {
            if (homeView && homeView.classList.contains('active-view')) {
                progressContainer.style.display = 'block';
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                myBar.style.width = scrolled + "%";
            } else {
                progressContainer.style.display = 'none';
            }
        }
    });

    // Contact Form handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual form submission
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            // Simulate network request
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                
                formStatus.classList.remove('hidden');
                
                // Hide status message after 3 seconds
                setTimeout(() => {
                    formStatus.classList.add('hidden');
                }, 3000);
            }, 1000);
        });
    }

    // Add subtle reveal animations for elements as they scroll into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply to project cards and resume items
    const elementsToAnimate = document.querySelectorAll('.project-card, .resume-item, .blog-post-card, .about-text, .edu-card');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    if (themeToggle) {
        // Check for saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });

        function updateThemeIcon(theme) {
            if (theme === 'light') {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        }
    }
});

// Preloader Script - Fast fade in/out transition
(function() {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        // Show preloader immediately
        preloader.style.display = 'flex';
        
        // Hide preloader after a very short delay (just for smooth transition)
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Remove from DOM after transition completes
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }, 400); // Very fast - just 400ms total
    }
})();

// Header Scroll Effect
(function() {
    const header = document.getElementById('main-header');
    const nav = document.getElementById('header-nav');
    
    if (!header || !nav) return;
    
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            // Scrolled down - make header more compact
            header.classList.add('scrolled');
            header.classList.remove('shadow-md');
            header.classList.add('shadow-lg');
            nav.classList.remove('py-4', 'lg:py-6');
            nav.classList.add('py-3', 'lg:py-4');
        } else {
            // At top - restore original size
            header.classList.remove('scrolled');
            header.classList.remove('shadow-lg');
            header.classList.add('shadow-md');
            nav.classList.remove('py-3', 'lg:py-4');
            nav.classList.add('py-4', 'lg:py-6');
        }
        
        lastScrollY = currentScrollY;
    };
    
    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Check initial scroll position
    handleScroll();
})();

// Active Menu Item Detection Based on Scroll Position
(function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = {
        projects: document.getElementById('projects'),
        about: document.getElementById('about'),
        contact: document.getElementById('contact')
    };
    
    if (navLinks.length === 0) return;
    
    const updateActiveNav = () => {
        const scrollPosition = window.scrollY + 150; // Offset for header height + some padding
        
        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Determine which section is active
        let activeSection = null;
        
        // Check if we're past the hero section
        const heroSection = document.getElementById('hero-section');
        if (heroSection) {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            if (scrollPosition < heroBottom) {
                // Still in hero section, no active menu item
                return;
            }
        }
        
        // Check each section to see which one is in view
        if (sections.projects) {
            const projectsTop = sections.projects.offsetTop;
            const projectsBottom = sections.projects.offsetTop + sections.projects.offsetHeight;
            
            if (scrollPosition >= projectsTop && scrollPosition < projectsBottom) {
                activeSection = 'projects';
            }
        }
        
        if (sections.about) {
            const aboutTop = sections.about.offsetTop;
            const aboutBottom = sections.about.offsetTop + sections.about.offsetHeight;
            
            if (scrollPosition >= aboutTop && scrollPosition < aboutBottom) {
                activeSection = 'about';
            }
        }
        
        if (sections.contact) {
            const contactTop = sections.contact.offsetTop;
            
            // For contact (footer), if we're past its top, it's active
            if (scrollPosition >= contactTop) {
                activeSection = 'contact';
            }
        }
        
        // Add active class to the corresponding nav link
        if (activeSection) {
            const activeLink = document.querySelector(`[data-nav="${activeSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    };
    
    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Check initial position
    updateActiveNav();
})();

// Mobile menu functionality removed - menu items now always visible

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Project modal interactions
const projectModal = document.getElementById('project-modal');
const projectModalBody = document.getElementById('project-modal-body');
const projectModalClose = document.getElementById('project-modal-close');

const openProjectModal = (projectId) => {
    if (!projectModal || !projectModalBody) return;
    const template = document.getElementById(`project-${projectId}-template`);
    if (!template) return;

    projectModalBody.innerHTML = '';
    projectModalBody.appendChild(template.content.cloneNode(true));
    projectModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
};

const closeProjectModal = () => {
    if (!projectModal || !projectModalBody) return;
    projectModal.classList.add('hidden');
    projectModalBody.innerHTML = '';
    document.body.classList.remove('overflow-hidden');
};

// Attach click handlers to project cards (using event delegation for dynamically rendered content)
document.addEventListener('click', (e) => {
    const projectCard = e.target.closest('[data-project-id]');
    if (projectCard) {
        const projectId = projectCard.getAttribute('data-project-id');
        if (projectId) {
            openProjectModal(projectId);
        }
    }
});

if (projectModalClose) {
    projectModalClose.addEventListener('click', closeProjectModal);
}

if (projectModal) {
    projectModal.addEventListener('click', (event) => {
        if (event.target === projectModal) {
            closeProjectModal();
        }
    });
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && projectModal && !projectModal.classList.contains('hidden')) {
        closeProjectModal();
    }
});

// Glob gradient cursor follower
(function() {
    const heroSection = document.getElementById('hero-section');
    const glob1 = document.getElementById('glob-1');
    const glob2 = document.getElementById('glob-2');

    if (!heroSection || !glob1 || !glob2) {
        console.error('Could not find hero section or glob elements');
        return;
    }

    // Add will-change for better performance
    glob1.style.willChange = 'transform';
    glob2.style.willChange = 'transform';
    
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate normalized position (-1 to 1, center is 0)
        const normalizedX = (x / rect.width) * 2 - 1;
        const normalizedY = (y / rect.height) * 2 - 1;
        
        // Movement intensity (in pixels) - increased for more visible effect
        const maxMove1 = 200; // Maximum movement for glob 1
        const maxMove2 = 150; // Maximum movement for glob 2
        
        // Calculate movement with stronger effect
        const moveX1 = normalizedX * maxMove1;
        const moveY1 = normalizedY * maxMove1;
        
        const moveX2 = normalizedX * maxMove2;
        const moveY2 = normalizedY * maxMove2;
        
        // Apply transform
        glob1.style.transform = `translate(${moveX1}px, ${moveY1}px)`;
        glob2.style.transform = `translate(${moveX2}px, ${moveY2}px)`;
    });
    
    // Reset to center when mouse leaves
    heroSection.addEventListener('mouseleave', () => {
        glob1.style.transform = 'translate(0px, 0px)';
        glob2.style.transform = 'translate(0px, 0px)';
    });
})();


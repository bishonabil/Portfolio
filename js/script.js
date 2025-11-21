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

// Mobile Menu Toggle Script
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

const openMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('hidden', 'mobile-menu-animate-out');
    // force reflow to restart animation reliably
    void mobileMenu.offsetWidth;
    mobileMenu.classList.add('mobile-menu-animate');
    mobileMenu.addEventListener('animationend', () => {
        mobileMenu.classList.remove('mobile-menu-animate');
    }, { once: true });
};

const closeMobileMenu = () => {
    if (!mobileMenu || mobileMenu.classList.contains('hidden') || mobileMenu.classList.contains('mobile-menu-animate-out')) return;
    mobileMenu.classList.remove('mobile-menu-animate');
    mobileMenu.classList.add('mobile-menu-animate-out');
    mobileMenu.addEventListener('animationend', () => {
        mobileMenu.classList.remove('mobile-menu-animate-out');
        mobileMenu.classList.add('hidden');
    }, { once: true });
};

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        if (mobileMenu.classList.contains('hidden')) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    });
}

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
            // Close mobile menu if open
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                closeMobileMenu();
            }
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


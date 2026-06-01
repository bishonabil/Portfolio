// Preloader Script
(function () {
    const preloader = document.getElementById('preloader');

    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        });
    }
})();

// Header Scroll Effect
(function () {
    const header = document.getElementById('main-header');
    const nav = document.getElementById('header-nav');

    if (!header || !nav) return;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 20) {
            // Scrolled state
            header.classList.add('shadow-lg', 'shadow-indigo-500/5');
            header.classList.replace('bg-gray-950/80', 'bg-gray-950/95');
            nav.classList.remove('py-4', 'lg:py-5');
            nav.classList.add('py-3', 'lg:py-4');
        } else {
            // Top state
            header.classList.remove('shadow-lg', 'shadow-indigo-500/5');
            header.classList.replace('bg-gray-950/95', 'bg-gray-950/80');
            nav.classList.remove('py-3', 'lg:py-4');
            nav.classList.add('py-4', 'lg:py-5');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on load
})();

// Active Menu Item Detection
(function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = ['hero-section', 'projects', 'about', 'contact'];

    const updateActiveNav = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;

        // Find current section based on which section is most visible in viewport
        let currentSection = '';
        let maxVisibleHeight = 0;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + window.scrollY;
                const sectionBottom = sectionTop + section.offsetHeight;

                // Calculate how much of the section is visible
                const visibleTop = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));

                // If more than half of viewport shows this section, or if we're near the top and it's hero
                if (visibleTop > maxVisibleHeight) {
                    maxVisibleHeight = visibleTop;
                    currentSection = sectionId;
                }

                // Special case: if we're at the very top (within 100px), always show hero as active
                if (scrollPosition < 100) {
                    currentSection = 'hero-section';
                }
            }
        });

        // Update links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-nav') === currentSection) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
})();

// Mobile Menu Toggle
(function () {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
})();

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }

        if (targetId === '#') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            history.pushState(null, null, ' '); // remove hash
            return;
        }

        const target = document.querySelector(targetId);

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Update URL hash without jumping
            history.pushState(null, null, targetId);
        }
    });
});

// Project Modal Logic
const projectModal = document.getElementById('project-modal');
const projectModalContainer = projectModal ? projectModal.querySelector('.rounded-3xl') : null;
const projectModalBody = document.getElementById('project-modal-body');
const projectModalClose = document.getElementById('project-modal-close');

const TRANSITION_DURATION = 300;
let modalTimeout = null;
let isClosing = false;

const openProjectModal = (projectId) => {
    if (!projectModal || !projectModalBody) return;
    const template = document.getElementById(`project-${projectId}-template`);
    if (!template) return;

    // 1. PREVENT RACE CONDITION: Clear any pending close actions
    if (modalTimeout) {
        clearTimeout(modalTimeout);
        modalTimeout = null;
    }
    isClosing = false;

    // 2. Inject HTML
    projectModalBody.innerHTML = '';
    projectModalBody.appendChild(template.content.cloneNode(true));

    // 3. SHOW MODAL: Safely alter classes
    projectModal.classList.remove('hidden', 'pointer-events-none');
    document.body.classList.add('overflow-hidden');

    // Force reflow
    void projectModal.offsetWidth;

    // Trigger animations
    if (projectModal.classList.contains('opacity-0')) {
        projectModal.classList.replace('opacity-0', 'opacity-100');
    } else {
        projectModal.classList.add('opacity-100');
    }

    if (projectModalContainer) {
        projectModalContainer.classList.remove('scale-95');
        projectModalContainer.classList.add('scale-100');
    }

    // Animate content in
    const content = projectModalBody.firstElementChild;
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        content.style.transition = 'all 0.4s ease-out';

        requestAnimationFrame(() => {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        });
    }
};

const closeProjectModal = () => {
    if (!projectModal || !projectModalBody) return;
    if (isClosing) return;
    isClosing = true;

    // 1. Fade out and block interactions
    if (projectModal.classList.contains('opacity-100')) {
        projectModal.classList.replace('opacity-100', 'opacity-0');
    } else {
        projectModal.classList.add('opacity-0');
    }
    projectModal.classList.add('pointer-events-none');

    if (projectModalContainer) {
        projectModalContainer.classList.replace('scale-100', 'scale-95');
    }

    // 2. DELAY CLEANUP
    modalTimeout = setTimeout(() => {
        if (isClosing) {
            projectModal.classList.add('hidden');
            projectModalBody.innerHTML = '';
            document.body.classList.remove('overflow-hidden');
            isClosing = false;
        }
    }, TRANSITION_DURATION);
};

// Event Delegation for Project Cards
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

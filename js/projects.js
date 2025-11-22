/**
 * Projects Data Configuration
 * 
 * To add a new project, simply add a new object to the projects array below.
 * 
 * Required fields:
 * - id: Unique identifier (lowercase, no spaces, e.g., 'my-project')
 * - title: Project title
 * - category: Project category (e.g., 'Web App', 'Mobile App', 'E-Commerce')
 * - shortDescription: Brief description shown on the project card
 * - fullDescription: Detailed description shown in the modal
 * - url: Project URL
 * - image: Main image URL (desktop/laptop view)
 * - imageTablet: Tablet view image URL
 * - imageMobile: Mobile view image URL
 * - technologies: Array of technology names
 * - gradientColor: 'indigo' or 'cyan' (determines color scheme)
 * - layout: 'left' or 'right' (device mockup position in modal)
 * 
 * Example:
 * {
 *     id: 'my-project',
 *     title: 'My Awesome Project',
 *     category: 'Web App',
 *     shortDescription: 'A modern web application',
 *     fullDescription: 'Detailed description of the project...',
 *     url: 'https://example.com',
 *     image: 'assets/images/project-desktop.jpg',
 *     imageTablet: 'assets/images/project-tablet.jpg',
 *     imageMobile: 'assets/images/project-mobile.jpg',
 *     technologies: ['React', 'Node.js', 'MongoDB'],
 *     gradientColor: 'indigo',
 *     layout: 'left'
 * }
 */
const projects = [
    {
        id: 'Web Development',
        title: 'Cosmo5 Global Website',
        category: 'Web Development',
        shortDescription: 'Dynamic WordPress Conversion',
        fullDescription: 'Cosmo5 is a global marketing group operating across 18 countries. I rebuilt their entire static PHP website into a fully dynamic WordPress system, enabling effortless content updates through a modular dashboard. The project included creating reusable templates, custom modules, and flexible page structures using PHP, JavaScript, CSS, and WordPress to deliver a scalable, future-proof site.',
        url: 'https://cosmo5.com',
        image: 'assets/images/cosmodesktop.png',
        imageTablet: 'assets/images/cosmotablet.png',
        imageMobile: 'assets/images/cosmomobile.png',
        technologies: ['WordPress', 'PHP', 'CSS', 'JavaScript'],
        gradientColor: 'indigo', // Options: 'indigo' or 'cyan'
        layout: 'left' // Options: 'left' or 'right' (for device mockup position)
    },
    {
        id: 'E-Commerce',
        title: 'Jordan Harvest Website',
        category: 'E-Commerce',
        shortDescription: 'WooCommerce Store Development',
        fullDescription: 'Jordan Harvest is a premium dates company rooted in centuries of agricultural heritage, offering high-quality Medjool, Barhi, and regional Middle Eastern varieties. For this project, I developed a full WooCommerce website that reflects their brand identity and supports scalable e-commerce operations. The build included custom product layouts, optimized structures for their catalog, and JavaScript enhancements to improve product-page interactions and user experience.',
        url: '',
        image: 'assets/images/jordandesktop.png',
        imageTablet: 'assets/images/jordantablet.png',
        imageMobile: 'assets/images/jordanmobile.png',
        technologies: ['WordPress', 'WooCommerce', 'JavaScript', 'CSS'],
        gradientColor: 'cyan',
        layout: 'right'
    },
    {
        id: 'WordPress Development',
        title: 'MFDP Law Firm Website',
        category: 'WordPress Development',
        shortDescription: 'Dynamic WordPress Platform',
        fullDescription: 'MFDP is a global-minded law firm offering expert legal support across complex deals, disputes, and diverse industries. For this project, I built a fully dynamic WordPress website featuring customizable lawyer and associate profiles, a flexible service-pages network powered by ACF fields, and a dedicated article post type with a clean, modern template. The entire site is structured for easy content updates while maintaining a polished, professional presentation aligned with the firm’s brand.',
        url: 'https://mfdplegal.com/',
        image: 'assets/images/mfdpdesktop.png',
        imageTablet: 'assets/images/mfdptablet.png',
        imageMobile: 'assets/images/mfdpmobile.png',
        technologies: ['WordPress', 'CSS', 'JavaScript'],
        gradientColor: 'indigo',
        layout: 'left'
    },
    {
        id: 'Landing Page',
        title: 'Aklne App Website',
        category: 'Landing Page',
        shortDescription: 'Mobile App Showcase Website',
        fullDescription: 'Aklne is a smart food recommendation app that helps users discover new recipes, restaurants, and markets with ease. For this project, I built a clean, modern one-page website designed to showcase the app’s features and drive downloads. The layout follows a user-centric UI approach, using the brand’s color palette and visual identity to create an eye-pleasing, engaging experience.',
        url: 'https://aklne.com/',
        image: 'assets/images/aklnedesktop.png',
        imageTablet: 'assets/images/aklnetablet.png',
        imageMobile: 'assets/images/aklnemobile.png',
        technologies: ['WordPress', 'CSS', 'JavaScript'],
        gradientColor: 'cyan',
        layout: 'right'
    },
    {
        id: 'WordPress Development',
        title: 'tawakol Law Firm website',
        category: 'WordPress Development',
        shortDescription: 'Professional Law Firm Website',
        fullDescription: 'Tawakkul is a reputable law firm specializing in corporate law and dispute resolution. I built a fully responsive WordPress website using a refined, modern template customized to match the firm’s professional identity. The result is a clean, elegant, and reliable online presence that works seamlessly across all devices.',
        url: 'https://tawakollaw.com/',
        image: 'assets/images/tawakoldesktop.png',
        imageTablet: 'assets/images/tawakoltablet.png',
        imageMobile: 'assets/images/tawakolmobile.png',
        technologies: ['WordPress', 'CSS'],
        gradientColor: 'cyan',
        layout: 'left'
    }
];

// Helper function to get gradient classes based on color
function getGradientClasses(color) {
    const gradients = {
        indigo: {
            card: 'from-indigo-500/20 via-gray-900/70 to-gray-950/90',
            badge: 'bg-white/20 backdrop-blur',
            badgeModal: 'bg-indigo-100 text-indigo-700',
            tech: 'text-indigo-700 border-indigo-100',
            link: 'text-indigo-600'
        },
        cyan: {
            card: 'from-cyan-400/30 via-slate-900/70 to-slate-950/90',
            badge: 'bg-white/20 backdrop-blur',
            badgeModal: 'bg-cyan-100 text-cyan-700',
            tech: 'text-cyan-700 border-cyan-100',
            link: 'text-cyan-600'
        }
    };
    return gradients[color] || gradients.indigo;
}

// Render project cards in the grid
function renderProjectCards() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = projects.map(project => {
        const gradient = getGradientClasses(project.gradientColor);
        
        return `
            <button type="button" data-project-id="${project.id}" class="relative overflow-hidden rounded-3xl text-left shadow-xl bg-gray-900 group focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/60 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div class="absolute inset-0">
                    <img src="${project.image}" alt="${project.title} preview" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                </div>
                <div class="absolute inset-0 bg-gradient-to-br ${gradient.card} transition-opacity duration-500 group-hover:opacity-100"></div>
                <div class="relative flex flex-col flex-1 h-full p-6 sm:p-8 text-white">
                    <div class="space-y-3 mb-6">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${gradient.badge}">
                            ${project.category}
                        </span>
                        <div>
                            <p class="text-sm text-white/70">${project.shortDescription}</p>
                            <h3 class="text-2xl font-black mt-1 leading-tight">
                                ${project.title}
                            </h3>
                        </div>
                    </div>
                    <div class="mt-auto flex items-center justify-between text-xs sm:text-sm text-white/70 pt-4">
                        <span class="truncate pr-4">${project.url}</span>
                        <span class="inline-flex items-center gap-2 font-semibold text-white group-hover:gap-3 transition-all">
                            View
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H7"></path>
                            </svg>
                        </span>
                    </div>
                </div>
            </button>
        `;
    }).join('');
}

// Render project detail templates
function renderProjectTemplates() {
    const templatesContainer = document.getElementById('project-templates-container');
    if (!templatesContainer) return;

    templatesContainer.innerHTML = projects.map(project => {
        const gradient = getGradientClasses(project.gradientColor);
        const layoutClass = project.layout === 'right' ? 'flex-col-reverse lg:flex-row' : 'flex-col lg:flex-row';
        
        return `
            <template id="project-${project.id}-template">
                <section class="relative rounded-3xl p-6 sm:p-10 lg:p-12">
                    <div class="flex ${layoutClass} gap-10 lg:gap-14 items-center relative z-10">
                        <div class="w-full lg:w-1/2 flex justify-center items-center lg:min-h-[440px]">
                            <div class="devices-container">
                                <div class="device-laptop">
                                    <div class="device-laptop-screen" style="background-image: url('${project.image}');"></div>
                                </div>
                                <div class="device-tablet">
                                    <div class="device-tablet-screen" style="background-image: url('${project.imageTablet}');"></div>
                                </div>
                                <div class="device-mobile">
                                    <div class="device-mobile-screen" style="background-image: url('${project.imageMobile}');"></div>
                                </div>
                            </div>
                        </div>
                        <div class="w-full lg:w-1/2 space-y-6">
                            <div class="space-y-3">
                                <span class="inline-flex items-center px-4 py-1.5 rounded-full ${gradient.badgeModal} text-xs font-semibold uppercase tracking-widest">
                                    ${project.category}
                                </span>
                                <h2 class="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
                                    ${project.title}
                                </h2>
                                <p class="text-base text-gray-500 font-semibold">${project.shortDescription}</p>
                            </div>
                            <p class="text-lg sm:text-xl text-gray-700 leading-relaxed">
                                ${project.fullDescription}
                            </p>
                            <div class="flex flex-wrap gap-3">
                                ${project.technologies.map(tech => {
                                    const borderClass = gradient.tech.includes('indigo') ? 'border-indigo-100' : 'border-cyan-100';
                                    return `
                                    <span class="px-4 py-2 bg-white ${gradient.tech} rounded-full text-sm font-semibold border ${borderClass} shadow-sm">
                                        ${tech}
                                    </span>
                                `;
                                }).join('')}
                            </div>
                            <div class="flex flex-wrap items-center gap-6 pt-2">
                                <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-3 ${gradient.link} font-semibold">
                                    Visit Project
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H5"></path>
                                    </svg>
                                </a>
                                <span class="text-sm text-gray-500">
                                    ${project.url}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </template>
        `;
    }).join('');
}

// Initialize projects on page load
document.addEventListener('DOMContentLoaded', () => {
    renderProjectCards();
    renderProjectTemplates();
});


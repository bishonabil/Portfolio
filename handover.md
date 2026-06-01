# Project Handover Documentation: Bishoy Nabil Portfolio

This document provides a comprehensive technical overview and handover guide for the **Bishoy Nabil Portfolio** website. It outlines the technology stack, system architecture, file structure, key features, and maintenance procedures.

---

## 1. Project Overview
The **Bishoy Nabil Portfolio** is a premium, high-performance, single-page portfolio website designed for a Full-Stack Web Developer. It showcases featured projects using custom-built mockups, includes interactive elements like cursor-following particles, and provides quick access to contact information (Email, WhatsApp, Phone).

- **Live URL**: [https://bishonabil.github.io/Portfolio/](https://bishonabil.github.io/Portfolio/)
- **Repository Name**: `bishonabil/Portfolio`

---

## 2. Technology Stack & Integrations

The project is built using a modern frontend stack designed for speed, visual appeal, and responsiveness:

| Technology / Library | Purpose | Integration Method |
| :--- | :--- | :--- |
| **HTML5** | Semantic web structure and layout. | Native |
| **Tailwind CSS (v3)** | Utility-first CSS framework for modern, responsive layouts and rapid styling. | CDN in [index.html](file:///d:/Portfolio/index.html) with custom configuration |
| **Custom CSS** | Advanced styling, device mockups, custom scrollbars, keyframe animations, and container queries. | [css/styles.css](file:///d:/Portfolio/css/styles.css) |
| **Vanilla JavaScript** | Core application logic, active section tracking, modal rendering, and particle interactions. | Native ES5/ES6 ([js/script.js](file:///d:/Portfolio/js/script.js), [js/projects.js](file:///d:/Portfolio/js/projects.js)) |
| **Font Awesome (v6.4.0)** | High-quality icons for social media and navigation. | CDN (Cloudflare) |
| **Google Fonts** | Premium typography using the `Outfit` and `Inter` font families. | Preconnected API imports |

---

## 3. Project Directory Structure

```
Portfolio/
├── .github/                # GitHub Actions or configurations
├── .vite/                  # Vite cache / development server state
├── assets/                 # Image and media assets
│   └── images/             
│       └── webp/           # Optimized WebP images for faster loading
├── css/
│   └── styles.css          # Custom CSS for mockups, scrollbars, and keyframe animations
├── js/
│   ├── projects.js         # Core data structure containing project metadata and card builders
│   └── script.js           # UI logic: preloader, smooth scrolling, active link tracking, modals, particles
├── index.html              # Main HTML entry point
├── package-lock.json       # Dependency tree lockfile (npm environment reference)
├── README.md               # User-facing project documentation
└── handover.md             # This technical handover guide
```

---

## 4. Feature Architecture & Code Details

### A. Dynamic Project Showcase
The project information is decoupled from the main HTML file. 
- **Configuration File**: All project data is stored as a JavaScript array in [js/projects.js](file:///d:/Portfolio/js/projects.js). Each project object contains titles, descriptions, categories, technologies, custom gradients, and paths to mockups (desktop, tablet, mobile).
- **Rendering Engines**:
  - `renderProjectCards()`: Dynamically generates portfolio cards into the `#projects-grid` container.
  - `renderProjectTemplates()`: Injects HTML `<template>` elements into the DOM, making them ready to load into the modal system when triggered.

### B. Interactive Project Modals
- **Trigger**: Click handlers listen for user actions on any card element matching `[data-project-id]` using event delegation in [js/script.js](file:///d:/Portfolio/js/script.js).
- **Template Clones**: When clicked, the modal retrieves the corresponding project's template, cleans previous inputs, injects the new clone, and coordinates CSS transitions (scale-95 to scale-100, fade-in).
- **Device Mockups**: Features custom CSS-based device framing inside the modal:
  - Laptop base screen (`.device-laptop`)
  - Tablet screen (`.device-tablet`) overlay
  - Mobile screen (`.device-mobile`) overlay
  These styles are configured dynamically in [css/styles.css](file:///d:/Portfolio/css/styles.css#L221-L287) to scale and shift responsively on smaller viewports.

### C. Hero Section Cursor Particles
- Located in the background of the `#hero-section`.
- Two container groups are utilized: `.particles-container` and `.blured-particles-container`.
- A mousemove listener tracks the cursor coordinate relative to the hero section.
- An animation loop powered by `requestAnimationFrame` calculates the offset of each particle based on customized speed factors and rotation matrices, creating a pseudo-3D depth-parallax effect.

### D. Active Navigation Tracker
- The menu tracks the user's scroll position.
- Uses `getBoundingClientRect()` to compute the viewport visibility of each section (`hero-section`, `projects`, `about`, `contact`).
- Dynamically assigns the `.active` class to matching links, which displays an animated bottom border.

---

## 5. Running & Customizing the Project

### Local Development
To run this project locally, simply:
1. Open the project folder in your IDE.
2. Open [index.html](file:///d:/Portfolio/index.html) using a local server (e.g., VS Code Live Server, or by running `npx vite` in the project directory if Vite packages are installed).

### Adding/Editing Projects
To add or modify portfolio items:
1. Open [js/projects.js](file:///d:/Portfolio/js/projects.js).
2. Append or edit a project object within the `projects` array:
   ```javascript
   {
       id: 'UniqueId',
       title: 'Project Title',
       category: 'Category Name',
       shortDescription: 'Brief catchphrase',
       fullDescription: 'Detailed breakdown of the build...',
       url: 'https://live-link.com',
       image: 'assets/images/webp/desktop.webp',
       imageTablet: 'assets/images/webp/tablet.webp',
       imageMobile: 'assets/images/webp/mobile.webp',
       technologies: ['React', 'Node.js', 'Tailwind'],
       gradientColor: 'indigo', // 'indigo' or 'cyan'
       layout: 'left'
   }
   ```
3. Save the file. The page will dynamically generate the new card and modal template.

---

## 6. Recommendations & Future Scope

1. **Optimize Package Dependencies**: While the project currently includes `package-lock.json`, the main `package.json` is not present in the root folder. If moving to a managed Node build tool (like Vite), re-initializing a `package.json` with standard developer dependencies (Vite, PostCSS, Autoprefixer) will secure future build performance.
2. **Move CDN resources to Local Modules**: Serving Tailwind CSS, Font Awesome, and other third-party assets from locally hosted node modules or bundler packages would protect the site from connection hiccups, improve load times, and enable off-line development.
3. **SEO improvements**: Adding structured JSON-LD Schema markup for a personal portfolio would enhance search presence.

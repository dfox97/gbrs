/**
 * Centralized Photo Configuration
 * 
 * This file contains all photo paths used across the website.
 * Benefits:
 * - Change photo filenames in ONE place
 * - Easy to add new photos for projects
 * - Clear organization by category
 * - No performance impact (just constants)
 * - Helps maintain consistent SEO with descriptive names
 * 
 * Usage in HTML:
 * 1. Add <script src="js/photos.js"></script> to your HTML
 * 2. Use PHOTOS.LOGO, PHOTOS.SERVICES.STEEL_ERECTION, etc.
 * 
 * Usage in JavaScript:
 * - Import this file before your other scripts
 * - Reference photos using PHOTOS.PROJECTS.RECLAD_STOCKTON.IMAGES[0], etc.
 */

const PHOTOS = {
  // Company branding
  LOGO: 'photos/gbrs_ltd_logo.jpg',

  // Hero backgrounds
  HERO: {
    MAIN: 'photos/liams-steel-up.avif'
  },

  // Service card images
  SERVICES: {
    AGRICULTURAL: 'photos/George-gbrs/Agricultural/project-1-agricultural_building_1.jpg',
    INDUSTRIAL: 'photos/George-gbrs/Industrial/Industrial_building_1.jpg',
    STEEL_ERECTION: 'photos/George-gbrs/Steel-erection-&-cladding/Project-2-steel_erection_building_5.jpg',
    GROUNDWORKS: 'photos/George-gbrs/Groundworks-&-Civils/Groundworks_4.jpg',
    BUILDING_SUPPLIES: 'photos/George-gbrs/Steel-suppply-&-buiilding-materials/Steel_supply_building_2.jpg',
    MAINTENANCE: 'photos/George-gbrs/Building-maintenance-&-repairs/Project-maintenance.jpg',

    // Service page hero backgrounds (same image used for all)
    PAGE_HERO: 'photos/service-1.avif'
  },

  // Project photos organized by project
  PROJECTS: {
    RECLAD_STOCKTON: {
      THUMBNAIL: 'photos/George-gbrs/Industrial/Industrial_building_1.jpg',
      IMAGES: [
        'photos/George-gbrs/Industrial/Industrial_building_1.jpg',
        'photos/George-gbrs/Industrial/Industrial_building_2.jpg',
        'photos/George-gbrs/Industrial/Industrial_building_3.jpg',
      ]
    },

    DRYER_SHED: {
      THUMBNAIL: 'photos/George-gbrs/Agricultural/Dryer-shed-agricultural_building_1.jpg',
      IMAGES: [
        'photos/George-gbrs/Agricultural/Dryer-shed-agricultural_building_1.jpg',
        'photos/George-gbrs/Agricultural/Dryer-shed-agricultural_building_2.jpg',
        'photos/George-gbrs/Agricultural/Dryer-shed-agricultural_building_3.jpg',
        'photos/George-gbrs/Agricultural/Dryer-shed-agricultural_building_4.jpg',
      ]
    },

    LEANTO: {
      THUMBNAIL: 'photos/George-gbrs/Agricultural/project-1-agricultural_building_1.jpg',
      IMAGES: [
        'photos/George-gbrs/Agricultural/project-1-agricultural_building_1.jpg',
        'photos/George-gbrs/Agricultural/project-1-agricultural_building_2.jpg',
        'photos/George-gbrs/Agricultural/project-1-agricultural_building_3.jpg',
      ]
    },

    DOUBLE_SPAN: {
      THUMBNAIL: 'photos/George-gbrs/Agricultural/double-span-building.avif',
      IMAGES: [
        'photos/George-gbrs/Agricultural/double-span-building.avif',
      ]
    },

    GROUNDWORKS_PROJECT: {
      THUMBNAIL: 'photos/George-gbrs/Groundworks-&-Civils/Groundworks_4.jpg',
      IMAGES: [
        'photos/George-gbrs/Groundworks-&-Civils/Groundworks_1.jpg',
        'photos/George-gbrs/Groundworks-&-Civils/Groundworks_2.jpg',
        'photos/George-gbrs/Groundworks-&-Civils/Groundworks_3.jpg',
        'photos/George-gbrs/Groundworks-&-Civils/Groundworks_4.jpg',
      ]
    }
  },

  // Helper function to get relative path for nested pages
  getPath: function (photoPath) {
    if (photoPath.startsWith('http') || photoPath.startsWith('/')) {
      return photoPath; // Absolute paths or root-relative paths don't need adjustment
    }

    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);

    // Determine depth: 0 for root, 1 for /pages/, 2 for /pages/about-pages/, etc.
    let depth = 0;
    if (pathSegments.length > 0) {
      // Count directories before the filename
      depth = pathSegments.length - (pathSegments[pathSegments.length - 1].includes('.') ? 1 : 0);
    }

    let prefix = '';
    // If the path is nested, add '../' for each level
    // Assuming 'photos/' is at the root level alongside 'index.html'
    if (depth > 0) {
      if (currentPath.includes('/pages/')) { // Check for common nested page structure like /pages/about-pages/
        const pagePathDepth = currentPath.split('/pages/')[1] ? currentPath.split('/pages/')[1].split('/').length - 1 : 0;
        for (let i = 0; i <= pagePathDepth; i++) {
          prefix += '../';
        }
      }
    }
    return prefix + photoPath;
  },

  // Helper function to get full URL for meta tags
  getFullUrl: function (photoPath, domain = 'https://www.gbrsltd.co.uk') {
    return domain + '/' + photoPath;
  }
};

// Make it available globally
if (typeof window !== 'undefined') {
  window.PHOTOS = PHOTOS;

  // Auto-load images with data-photo attribute
  // This allows HTML to reference photos like: <img data-photo="PROJECTS.RECLAD_STOCKTON.THUMBNAIL">
  document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img[data-photo]');

    images.forEach(img => {
      const photoPathKey = img.getAttribute('data-photo');

      // Handle nested property access (e.g., "PROJECTS.RECLAD_STOCKTON.THUMBNAIL")
      const pathSegments = photoPathKey.split('.');
      let value = PHOTOS;

      for (let key of pathSegments) {
        value = value[key];
        if (value === undefined) {
          console.error(`Photo path not found from PHOTOS object: ${photoPathKey}`);
          return;
        }
      }
      img.src = PHOTOS.getPath(value);
    });

    // Handle background images set via data-bg-photo
    const bgElements = document.querySelectorAll('[data-bg-photo]');
    bgElements.forEach(el => {
      const photoPathKey = el.getAttribute('data-bg-photo');
      const pathSegments = photoPathKey.split('.');
      let value = PHOTOS;

      for (let key of pathSegments) {
        value = value[key];
        if (value === undefined) {
          console.error(`Background photo path not found from PHOTOS object: ${photoPathKey}`);
          return;
        }
      }
      el.style.backgroundImage = `url('${PHOTOS.getPath(value)}')`;
    });
  });
}

// For Node.js environments (if needed for build tools)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PHOTOS;
}

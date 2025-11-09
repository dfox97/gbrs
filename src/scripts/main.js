// Smooth scroll with offset for sticky header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu after clicking
      if (nav && nav.classList.contains('show')) {
        nav.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !expanded);
    nav.classList.toggle('show');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('show') &&
      !nav.contains(e.target) &&
      !toggle.contains(e.target)) {
      nav.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('show')) {
      nav.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}

// Mobile dropdown toggle with smooth animation
document.querySelectorAll('.nav-item').forEach(item => {
  const link = item.querySelector('.nav-link-with-dropdown');
  const dropdown = item.querySelector('.nav-dropdown');

  if (link && dropdown) {
    link.addEventListener('click', (e) => {
      if (window.innerWidth < 1024) {
        e.preventDefault();

        const isOpen = item.classList.contains('mobile-open');

        document.querySelectorAll('.nav-item').forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('mobile-open')) {
            const otherDropdown = otherItem.querySelector('.nav-dropdown');
            otherItem.classList.remove('mobile-open');
            if (otherDropdown) {
              otherDropdown.style.maxHeight = '0px';
            }
          }
        });

        if (!isOpen) {
          item.classList.add('mobile-open');
          dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
        } else {
          item.classList.remove('mobile-open');
          dropdown.style.maxHeight = '0px';
        }
      }
    });
  }
});

// Desktop dropdown keyboard navigation
document.querySelectorAll('.nav-item').forEach(navItem => {
  const mainLink = navItem.querySelector('.nav-link-with-dropdown');
  const dropdown = navItem.querySelector('.nav-dropdown');
  const dropdownLinks = dropdown ? Array.from(dropdown.querySelectorAll('a')) : [];

  if (!mainLink || !dropdown) return;

  let currentFocusIndex = -1;

  mainLink.addEventListener('keydown', (e) => {
    if (window.innerWidth < 1024) return;

    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (dropdownLinks.length > 0) {
        currentFocusIndex = 0;
        dropdownLinks[0].focus();
      }
    }
  });

  dropdownLinks.forEach((link, index) => {
    link.addEventListener('keydown', (e) => {
      if (window.innerWidth < 1024) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentFocusIndex = (index + 1) % dropdownLinks.length;
        dropdownLinks[currentFocusIndex].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (index === 0) {
          mainLink.focus();
          currentFocusIndex = -1;
        } else {
          currentFocusIndex = index - 1;
          dropdownLinks[currentFocusIndex].focus();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        mainLink.focus();
        currentFocusIndex = -1;
      }
    });
  });
});

// Netlify form handling with better UX
const form = document.getElementById("contact-form");
const successMessage = document.getElementById("form-success");

if (form && successMessage) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    submitBtn.style.opacity = '0.7';

    const data = new FormData(form);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString()
      });

      if (response.ok) {
        form.reset();
        successMessage.textContent = "✅ Thank you! We'll get back to you within 24 hours.";
        successMessage.style.color = "#28a745";
        successMessage.style.background = "#d4edda";
        successMessage.style.padding = "15px";
        successMessage.style.borderRadius = "6px";

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      successMessage.textContent = "⚠️ Something went wrong. Please email us directly or try again.";
      successMessage.style.color = "#721c24";
      successMessage.style.background = "#f8d7da";
      successMessage.style.padding = "15px";
      successMessage.style.borderRadius = "6px";
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.style.opacity = '1';

      // Clear message after 10 seconds
      setTimeout(() => {
        successMessage.textContent = "";
        successMessage.style.padding = "0";
      }, 10000);
    }
  });
}

// Add active state to nav on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a');

if (sections.length && navLinks.length) {
  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// PROJECT GALLERY MODAL FUNCTIONALITY
// Note: Photo paths are defined in js/photos.js for centralized management
const projectGalleries = {
  recladStockton: {
    title: 'Industrial Recladding - Stockton',
    images: PHOTOS.PROJECTS.RECLAD_STOCKTON.IMAGES.map((src, index) => ({
      src: src,
      alt: `Recladding project Stockton - view ${index + 1}`
    }))
  },
  dryer: {
    title: 'Bespoke Dryer Shed',
    images: PHOTOS.PROJECTS.DRYER_SHED.IMAGES.map((src, index) => ({
      src: src,
      alt: `Dryer shed project - view ${index + 1}`
    }))
  },
  groundworksRoadway: {
    title: 'Groundworks and Civil Engineering',
    images: PHOTOS.PROJECTS.GROUNDWORKS_PROJECT.IMAGES.map((src, index) => ({
      src: src,
      alt: `Groundworks project - view ${index + 1}`
    }))
  },
  leanto: {
    title: '80x20ft Lean-to Structure',
    images: PHOTOS.PROJECTS.LEANTO.IMAGES.map((src, index) => ({
      src: src,
      alt: `Lean-to structure project - view ${index + 1}`
    }))
  },
};


const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalGallery = document.querySelector('.modal-gallery');
const modalCounter = document.querySelector('.modal-counter');
const modalClose = document.querySelector('.modal-close');
const modalPrev = document.querySelector('.modal-prev');
const modalNext = document.querySelector('.modal-next');

let currentProject = null;
let currentImageIndex = 0;

// Open modal when gallery button clicked
document.querySelectorAll('.view-gallery-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const projectKey = e.target.dataset.project;
    openGallery(projectKey);
  });
});

function openGallery(projectKey) {
  currentProject = projectGalleries[projectKey];
  if (!currentProject) return;

  currentImageIndex = 0;
  modalTitle.textContent = currentProject.title;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scroll
  // Set initial opacity for transition
  //modalGallery.style.transition = 'opacity 0.3s ease-in-out'; // Added ease-in-out
  modalGallery.style.opacity = '0'; // Start faded out

  // Use a slight delay to ensure CSS transition takes effect
  setTimeout(() => {
    updateGalleryImage();
  }, 50);
}

function updateGalleryImage() {
  if (!currentProject) return;

  const images = currentProject.images;
  const currentImage = images[currentImageIndex];

  // Create a new image element to preload
  const img = new Image();
  // Use PHOTOS.getPath here to resolve the path correctly for nested pages
  img.src = PHOTOS.getPath(currentImage.src);
  img.alt = currentImage.alt;
  img.style.maxWidth = '100%'; // Ensure image scales
  img.style.maxHeight = '70vh'; // Ensure image fits viewport
  img.style.objectFit = 'contain';
  img.style.display = 'block';

  // Show loading state or previous image while new one loads
  modalGallery.style.opacity = '0'; // Fade out current image/loading state

  img.onload = () => {
    modalGallery.innerHTML = ''; // Clear previous image
    modalGallery.appendChild(img); // Add new loaded image

    // Fade in the new image
    modalGallery.style.opacity = '1';
  };

  img.onerror = () => {
    // Handle image loading error, e.g., display a placeholder
    modalGallery.innerHTML = `<p style="color:white; text-align:center;">Error loading image</p>`;
    modalGallery.style.opacity = '1';
  };


  modalCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;

  // Enable/disable navigation buttons
  modalPrev.disabled = currentImageIndex === 0;
  modalNext.disabled = currentImageIndex === images.length - 1;

  // Preload next and previous images
  if (currentImageIndex + 1 < images.length) {
    // Apply PHOTOS.getPath to the preloaded image src
    new Image().src = PHOTOS.getPath(images[currentImageIndex + 1].src);
  }
  if (currentImageIndex - 1 >= 0) {
    // Apply PHOTOS.getPath to the preloaded image src
    new Image().src = PHOTOS.getPath(images[currentImageIndex - 1].src);
  }
}

function closeGallery() {
  modal.classList.remove('active');
  document.body.style.overflow = ''; // Restore scroll
  currentProject = null;
  currentImageIndex = 0;
  modalGallery.style.opacity = ''; // Reset opacity
  modalGallery.style.transition = ''; // Reset transition
  modalGallery.innerHTML = ''; // Clear gallery content on close
}

// Event listeners
if (modalClose) {
  modalClose.addEventListener('click', closeGallery);
}

if (modalPrev) {
  modalPrev.addEventListener('click', () => {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      updateGalleryImage();
    }
  });
}

if (modalNext) {
  modalNext.addEventListener('click', () => {
    if (currentProject && currentImageIndex < currentProject.images.length - 1) {
      currentImageIndex++;
      updateGalleryImage();
    }
  });
}

// Close on background click
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeGallery();
    }
  });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('active')) return;

  if (e.key === 'Escape') {
    closeGallery();
  } else if (e.key === 'ArrowLeft') {
    // Only navigate if not disabled
    if (!modalPrev.disabled) {
      currentImageIndex--;
      updateGalleryImage();
    }
  } else if (e.key === 'ArrowRight') {
    // Only navigate if not disabled
    if (!modalNext.disabled) {
      currentImageIndex++;
      updateGalleryImage();
    }
  }
});


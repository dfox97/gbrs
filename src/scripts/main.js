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

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

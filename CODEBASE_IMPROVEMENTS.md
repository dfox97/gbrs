# Astro Migration & Codebase Improvement Roadmap

This document outlines recommended steps to further modernize the GBRS codebase, leveraging Astro's full potential. The goal is to increase maintainability, type safety, and reusability.

## 1. Content Architecture (High Priority)

Moving more hardcoded content into **Content Collections** will make the site easier to manage and allow you to reuse data across different pages (e.g., showing "Related Projects" on a Service page).

### A. Create a `services` Collection
Currently, service pages (`agricultural.astro`, `industrial.astro`, etc.) are manually created.
*   **Action:** Create `src/content/services/` (e.g., `agricultural.md`, `industrial.md`).
*   **Benefit:** You can generate the "Our Services" grid on the Homepage dynamically, ensuring the titles, icons, and descriptions always match the actual service pages.
*   **Linkage:** You could add a `relatedProjects` field to the Service frontmatter to automatically pull in relevant projects without hardcoding `getEntry` calls in the page logic.

### B. Team & Testimonials Data
*   **Action:** Create a JSON data file (e.g., `src/data/team.json` or `src/content/team/`) for team members.
*   **Benefit:** The "Meet the Team" section in `about.astro` becomes a loop. Adding a new team member is just adding an entry to the data file.

---

## 2. Component Reusability (UI Library)

You mentioned wanting "nice reusable components." Here are the key candidates to extract:

### A. `Section` and `Container` Components
Instead of manually writing `<section class="section"><div class="container">...</div></section>` every time:
*   **Create:** `<Section>` component.
*   **Props:** `id`, `background` (white/grey), `className`.
*   **Usage:**
    ```astro
    <Section id="about" variant="light">
      <h2>Who We Are</h2>
      <slot />
    </Section>
    ```

### B. `Button` Component
Currently, we use CSS classes `.btn-primary`, `.view-gallery-btn`.
*   **Create:** `<Button>` component.
*   **Props:** `href` (optional), `variant` (primary/secondary/outline), `size`, `icon`.
*   **Benefit:** Centralized logic for hover states, accessibility attributes, and icons.

### C. `SectionHeader` Component
Repeated pattern: `span.section-tag` + `h2`.
*   **Create:** `<SectionHeader tag="Our Story" title="Who We Are" />`.
*   **Benefit:** Ensures consistent typography and spacing across all pages.

---

## 3. CSS & Styling Strategy

### A. Migrate Global CSS to Scoped CSS
Currently, styles are in `src/styles/` and imported globally.
*   **Recommendation:** Move specific styles into the Astro components that use them.
*   **Example:** Move `src/styles/components/cards.css` directly into the `<style>` block of `ProjectCard.astro`.
*   **Why:** Astro automatically scopes these styles. If you remove the component, the CSS is removed from the bundle. It prevents "dead code" and accidental style overrides.

### B. Design Tokens
Ensure `variables.css` is the single source of truth for:
*   Colors (`--primary`, `--secondary`)
*   Spacing (`--spacing-sm`, `--spacing-md`)
*   Border Radius
*   Shadows
*   **Action:** Replace arbitrary pixel values (e.g., `margin: 40px`) with variables (e.g., `margin: var(--spacing-xl)`).

---

## 4. Functionality & Performance

### A. View Transitions
Astro has built-in support for smooth page navigation (SPA feel without the SPA overhead).
*   **Action:** Add `<ViewTransitions />` to `Layout.astro`.
*   **Benefit:** Clicking a project link updates the content smoothly without a full browser refresh flash.

### B. Search Functionality
With 100+ projects, a dropdown filter might not be enough.
*   **Action:** Implement a search bar on the Projects page.
*   **Tools:** simple fuzzy search in JavaScript (using `fuse.js`) running on the client side against the project collection data.

---

## 5. Type Safety

### A. Strict Props Interfaces
Ensure every component (`.astro` file) has a defined TypeScript interface.
*   **Current:** Some components access `Astro.props` loosely.
*   **Goal:**
    ```typescript
    interface Props {
      title: string;
      variant?: 'light' | 'dark';
    }
    const { title, variant = 'light' } = Astro.props;
    ```
*   **Benefit:** VS Code will autocomplete props and warn you if you miss a required one or pass the wrong data type.

---

## 6. Immediate "Low Hanging Fruit"

1.  **`Hero.astro`:** Refactor `HeroOverlay.astro` to accept a background image prop, so it can be reused for the Service Page headers (currently `page-hero` divs) as well as the homepage.
2.  **`ContactForm.astro`:** Ensure it's fully reusable (e.g., accepting a custom success message or subject line).

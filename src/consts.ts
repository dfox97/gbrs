// Project Category Constants
export const PROJECT_CATEGORIES = {
  'agricultural': 'Agricultural',
  'industrial': 'Industrial',
  'recladding': 'Recladding',
  'groundworks': 'Groundworks',
  'new-build': 'New Build',
} as const;

export type ProjectCategoryKey = keyof typeof PROJECT_CATEGORIES;

// Service definitions for dynamic service pages
// Each service defines how to filter projects (by category OR services array)
export interface ServiceDefinition {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  // Filter projects by category OR by services array
  filterBy: {
    categories?: ProjectCategoryKey[];
    services?: string[];
  };
  introText: string;
}

export const SERVICES: ServiceDefinition[] = [
  {
    slug: 'agricultural',
    title: 'Agricultural Buildings',
    subtitle: 'Custom steel-framed structures for modern farming',
    description: 'Agricultural building projects by GBRS Services Hartlepool. View our completed grain stores, barns, livestock housing, and agricultural structures.',
    metaTitle: 'Agricultural Buildings Projects | GBRS Services',
    metaDescription: 'Agricultural building projects by GBRS Services Hartlepool. View our completed grain stores, barns, livestock housing, and agricultural structures.',
    filterBy: {
      categories: ['agricultural']
    },
    introText: 'View our completed agricultural building projects across the North East. From grain stores to livestock housing, we deliver functional, durable structures tailored to your farming needs.'
  },
  {
    slug: 'industrial',
    title: 'Industrial Buildings',
    subtitle: 'Robust steel-framed structures for your business needs',
    description: 'Industrial building projects by GBRS Services Hartlepool. View our completed warehouses, workshops, and commercial structures.',
    metaTitle: 'Industrial Buildings Projects | GBRS Services',
    metaDescription: 'Industrial building projects by GBRS Services Hartlepool. View our completed warehouses, workshops, and commercial structures.',
    filterBy: {
      categories: ['industrial', 'recladding']
    },
    introText: 'View our completed industrial building projects across the North East. From new builds to refurbishments, we deliver functional, durable structures tailored to your commercial and industrial requirements.'
  },
  {
    slug: 'groundworks',
    title: 'Groundworks & Foundations',
    subtitle: 'Solid foundations for every construction project',
    description: 'Groundworks and civil engineering projects by GBRS Services Hartlepool. Foundations, drainage, and site preparation.',
    metaTitle: 'Groundworks Projects | GBRS Services',
    metaDescription: 'Groundworks and civil engineering projects by GBRS Services Hartlepool. Foundations, drainage, and site preparation.',
    filterBy: {
      categories: ['groundworks']
    },
    introText: 'View our completed groundworks and foundation projects across the North East. We provide essential groundwork services from site preparation to concrete foundations.'
  },
  {
    slug: 'steel-erection',
    title: 'Steel Erection',
    subtitle: 'Expert steel frame construction for various structures',
    description: 'Steel erection and cladding projects by GBRS Services Hartlepool. Portal frames, cladding, and steel structures.',
    metaTitle: 'Steel Erection Projects | GBRS Services',
    metaDescription: 'Steel erection and cladding projects by GBRS Services Hartlepool. Portal frames, cladding, and steel structures.',
    filterBy: {
      services: ['steel-erection']
    },
    introText: 'Discover our steel erection projects across the North East. We provide professional and efficient steel frame installation for agricultural, industrial, and commercial buildings.'
  }
];

// Helper function to get service by slug
export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return SERVICES.find(s => s.slug === slug);
}

// Helper to check if a project matches a service filter
export function projectMatchesService(
  project: { category: ProjectCategoryKey; services?: string[] },
  service: ServiceDefinition
): boolean {
  const { filterBy } = service;
  
  // Check category filter
  if (filterBy.categories?.length) {
    if (filterBy.categories.includes(project.category)) {
      return true;
    }
  }
  
  // Check services array filter
  if (filterBy.services?.length && project.services) {
    if (filterBy.services.some(s => project.services?.includes(s))) {
      return true;
    }
  }
  
  return false;
}

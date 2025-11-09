let currentPage = 1;
const projectsPerPage = 12;
const totalProjects = 120;
const totalPages = Math.ceil(totalProjects / projectsPerPage);

const categoryFilter = document.getElementById('category-filter');
const showingCount = document.getElementById('showing-count');
const totalCount = document.getElementById('total-count');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const paginationNumbers = document.getElementById('pagination-numbers');

function updatePagination() {
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  
  showingCount.textContent = Math.min(currentPage * projectsPerPage, totalProjects);
  
  paginationNumbers.innerHTML = '';
  
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  if (startPage > 1) {
    const firstPage = createPageNumber(1);
    paginationNumbers.appendChild(firstPage);
    if (startPage > 2) {
      const ellipsis = document.createElement('span');
      ellipsis.textContent = '...';
      ellipsis.style.padding = '0 10px';
      ellipsis.style.color = '#999';
      paginationNumbers.appendChild(ellipsis);
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    const pageNumber = createPageNumber(i);
    paginationNumbers.appendChild(pageNumber);
  }
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement('span');
      ellipsis.textContent = '...';
      ellipsis.style.padding = '0 10px';
      ellipsis.style.color = '#999';
      paginationNumbers.appendChild(ellipsis);
    }
    const lastPage = createPageNumber(totalPages);
    paginationNumbers.appendChild(lastPage);
  }
}

function createPageNumber(pageNum) {
  const pageBtn = document.createElement('button');
  pageBtn.className = 'page-number';
  pageBtn.textContent = pageNum;
  pageBtn.setAttribute('aria-label', `Go to page ${pageNum}`);
  
  if (pageNum === currentPage) {
    pageBtn.classList.add('active');
    pageBtn.setAttribute('aria-current', 'page');
  }
  
  pageBtn.addEventListener('click', () => {
    currentPage = pageNum;
    updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  return pageBtn;
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

if (categoryFilter) {
  categoryFilter.addEventListener('change', (e) => {
    const selectedCategory = e.target.value;
    const projectCards = document.querySelectorAll('.project-card:not(.placeholder-card)');
    
    projectCards.forEach(card => {
      if (selectedCategory === 'all') {
        card.style.display = '';
      } else {
        const cardCategory = card.dataset.category;
        card.style.display = cardCategory === selectedCategory ? '' : 'none';
      }
    });
    
    currentPage = 1;
    updatePagination();
  });
}

updatePagination();

class PredictiveSearch {
  constructor() {
    this.drawer = document.getElementById('SearchDrawer');
    this.input = document.getElementById('SearchInput');
    this.resultsContainer = document.getElementById('SearchResults');
    this.clearBtn = document.getElementById('SearchClear');
    this.closeBtn = document.getElementById('SearchClose');
    this.backdrop = document.getElementById('SearchBackdrop');
    this.openBtns = document.querySelectorAll('[data-action="open-search"]');
    this.tags = document.querySelectorAll('.search-tag');

    this.debounceTimer = null;
    this.init();
  }

  init() {
    this.openBtns.forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.open();
    }));

    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    if (this.backdrop) this.backdrop.addEventListener('click', () => this.close());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.drawer.classList.contains('is-open')) {
        this.close();
      }
    });

    if (this.input) {
      this.input.addEventListener('input', () => {
        const query = this.input.value.trim();
        if (query.length > 0) {
          this.clearBtn.classList.remove('is-hidden');
          clearTimeout(this.debounceTimer);
          this.debounceTimer = setTimeout(() => this.search(query), 300);
        } else {
          this.clearBtn.classList.add('is-hidden');
          this.reset();
        }
      });
    }

    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => {
        this.input.value = '';
        this.clearBtn.classList.add('is-hidden');
        this.input.focus();
        this.reset();
      });
    }

    this.tags.forEach(tag => {
      tag.addEventListener('click', () => {
        const query = tag.getAttribute('data-query');
        if (this.input) {
          this.input.value = query;
          this.clearBtn.classList.remove('is-hidden');
          this.search(query);
        }
      });
    });
  }

  open() {
    if (!this.drawer) return;
    this.drawer.classList.add('is-open');
    this.drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => this.input && this.input.focus(), 100);
  }

  close() {
    if (!this.drawer) return;
    this.drawer.classList.remove('is-open');
    this.drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  async search(query) {
    if (!this.resultsContainer) return;
    this.resultsContainer.innerHTML = '<p class="text-center" style="padding: 2rem 0; opacity: 0.6;">Searching...</p>';

    try {
      const response = await fetch(`${window.Shopify?.routes?.root || '/'}search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,article,page&resources[limit]=6`);
      const data = await response.json();
      this.renderResults(data, query);
    } catch (err) {
      console.error('Search fetch error:', err);
      this.resultsContainer.innerHTML = '<p class="text-center text-muted">Error fetching search results.</p>';
    }
  }

  renderResults(data, query) {
    const products = data?.resources?.results?.products || [];
    const articles = data?.resources?.results?.articles || [];

    if (products.length === 0 && articles.length === 0) {
      this.resultsContainer.innerHTML = `
        <div style="padding: 2rem 0; text-align: center;">
          <p>No results found for "<strong>${this.escapeHTML(query)}</strong>"</p>
        </div>
      `;
      return;
    }

    let html = '';

    if (products.length > 0) {
      html += '<p class="text-subheading">Products</p><div class="search-results-grid">';
      products.forEach(product => {
        const image = product.featured_image?.url || product.image || '';
        const price = product.price ? `$${(parseFloat(product.price)).toFixed(2)}` : '';
        html += `
          <a href="${product.url}" class="search-result-item">
            ${image ? `<img src="${image}" alt="${this.escapeHTML(product.title)}" class="search-result-item__image" loading="lazy">` : ''}
            <div>
              <div class="search-result-item__title">${this.escapeHTML(product.title)}</div>
              <div class="search-result-item__price">${price}</div>
            </div>
          </a>
        `;
      });
      html += '</div>';
    }

    if (articles.length > 0) {
      html += '<p class="text-subheading" style="margin-top: 1.5rem;">Articles</p><div class="search-results-grid">';
      articles.forEach(article => {
        html += `
          <a href="${article.url}" class="search-result-item">
            <div>
              <div class="search-result-item__title">${this.escapeHTML(article.title)}</div>
            </div>
          </a>
        `;
      });
      html += '</div>';
    }

    html += `
      <div style="margin-top: 1.5rem; text-align: center;">
        <a href="/search?q=${encodeURIComponent(query)}" class="button button--secondary button--sm">
          View all results
        </a>
      </div>
    `;

    this.resultsContainer.innerHTML = html;
  }

  reset() {
    if (!this.resultsContainer) return;
    this.resultsContainer.innerHTML = `
      <div class="search-drawer__empty-state">
        <p class="text-subheading">Popular Searches</p>
        <div class="search-drawer__tags">
          <button type="button" class="search-tag" data-query="Best Sellers">Best Sellers</button>
          <button type="button" class="search-tag" data-query="New Arrivals">New Arrivals</button>
          <button type="button" class="search-tag" data-query="Hair Care">Hair Care</button>
          <button type="button" class="search-tag" data-query="Bundles">Bundles</button>
        </div>
      </div>
    `;

    this.resultsContainer.querySelectorAll('.search-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const query = tag.getAttribute('data-query');
        if (this.input) {
          this.input.value = query;
          this.clearBtn.classList.remove('is-hidden');
          this.search(query);
        }
      });
    });
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.predictiveSearch = new PredictiveSearch();
});

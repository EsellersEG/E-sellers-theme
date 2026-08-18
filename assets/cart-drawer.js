class CartDrawer {
  constructor() {
    this.drawer = document.getElementById('CartDrawer');
    this.backdrop = document.getElementById('CartDrawerBackdrop');
    this.closeBtn = document.getElementById('CartDrawerClose');
    this.openBtns = document.querySelectorAll('[data-action="open-cart"]');
    this.noteInput = document.getElementById('CartDrawerNote');
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
      if (e.key === 'Escape' && this.drawer && this.drawer.classList.contains('is-open')) {
        this.close();
      }
    });

    if (this.drawer) {
      this.drawer.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.getAttribute('data-action');
        const key = target.getAttribute('data-key');

        if (action === 'increase') {
          const countEl = target.parentElement.querySelector('.qty-count');
          const currentQty = parseInt(countEl.textContent, 10) || 1;
          this.updateQuantity(key, currentQty + 1);
        } else if (action === 'decrease') {
          const countEl = target.parentElement.querySelector('.qty-count');
          const currentQty = parseInt(countEl.textContent, 10) || 1;
          this.updateQuantity(key, Math.max(0, currentQty - 1));
        } else if (action === 'remove') {
          this.updateQuantity(key, 0);
        }
      });
    }

    if (this.noteInput) {
      let debounceNote;
      this.noteInput.addEventListener('input', () => {
        clearTimeout(debounceNote);
        debounceNote = setTimeout(() => {
          fetch('/cart/update.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note: this.noteInput.value })
          });
        }, 500);
      });
    }
  }

  open() {
    if (!this.drawer) return;
    this.drawer.classList.add('is-open');
    this.drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.drawer) return;
    this.drawer.classList.remove('is-open');
    this.drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  async updateQuantity(key, quantity) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity })
      });
      const cart = await response.json();
      await this.refreshDrawer();
    } catch (err) {
      console.error('Error changing cart quantity:', err);
    }
  }

  async addItem(items) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items)
      });
      const data = await response.json();
      await this.refreshDrawer();
      this.open();
      return data;
    } catch (err) {
      console.error('Error adding item to cart:', err);
      throw err;
    }
  }

  async refreshDrawer() {
    try {
      const response = await fetch(window.location.href);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      const newDrawer = doc.getElementById('CartDrawer');
      if (newDrawer && this.drawer) {
        this.drawer.innerHTML = newDrawer.innerHTML;
        this.init();
      }

      // Update cart count bubbles across the page
      const count = doc.querySelector('.cart-drawer__count')?.textContent || '';
      document.querySelectorAll('.cart-count-bubble').forEach(el => {
        el.textContent = count.replace(/[()]/g, '').trim();
      });
    } catch (err) {
      console.error('Error refreshing cart drawer:', err);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cartDrawer = new CartDrawer();
});

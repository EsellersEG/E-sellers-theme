/**
 * Cart Drawer Web Component - E-sellers Professional (v4.9.0)
 */

class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.overlay = this.querySelector('.cart-drawer__overlay');
    this.closeBtn = this.querySelector('.cart-drawer__close');
    this.inner = this.querySelector('.cart-drawer__inner');

    this.overlay?.addEventListener('click', this.close.bind(this));
    this.closeBtn?.addEventListener('click', this.close.bind(this));
    this.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') this.close();
    });

    // Connect open buttons across the page
    document.querySelectorAll('#CartDrawerOpener, [data-cart-drawer-trigger]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open(btn);
      });
    });

    // Listen to PubSub cart events (e.g. when product is added from product card or PDP)
    if (window.subscribe && window.PUB_SUB_EVENTS) {
      window.subscribe(window.PUB_SUB_EVENTS.cartUpdate, (data) => {
        this.renderDrawer();
        if (data.source === 'add') {
          this.open();
        }
      });
    }

    this.bindEvents();
  }

  bindEvents() {
    // Quantity change listeners
    this.querySelectorAll('.cart-quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const input = btn.closest('.cart-quantity-wrapper').querySelector('.cart-quantity-input');
        const line = btn.getAttribute('data-line');
        let qty = parseInt(input.value, 10);
        if (btn.name === 'plus') {
          qty += 1;
        } else {
          qty -= 1;
        }
        this.updateItem(line, Math.max(0, qty));
      });
    });

    // Remove item listeners
    this.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const line = btn.getAttribute('data-line');
        this.updateItem(line, 0);
      });
    });

    // Order note listener
    const noteInput = this.querySelector('#CartDrawer-Note');
    if (noteInput) {
      noteInput.addEventListener('change', window.debounce((e) => {
        window.ShopifyCart.updateNotes(e.target.value);
      }, 500));
    }
  }

  open(opener) {
    this.openedBy = opener;
    this.classList.add('is-open');
    this.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');
    if (window.trapFocus) window.trapFocus(this.inner);
    if (window.publish && window.PUB_SUB_EVENTS) {
      window.publish(window.PUB_SUB_EVENTS.drawerOpen, { drawer: 'cart' });
    }
  }

  close() {
    this.classList.remove('is-open');
    this.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overflow-hidden');
    if (window.removeTrapFocus) window.removeTrapFocus(this.inner);
    this.openedBy?.focus();
    if (window.publish && window.PUB_SUB_EVENTS) {
      window.publish(window.PUB_SUB_EVENTS.drawerClose, { drawer: 'cart' });
    }
  }

  async updateItem(line, quantity) {
    try {
      this.classList.add('is-loading');
      await window.ShopifyCart.change(line, quantity, ['cart-drawer']);
      await this.renderDrawer();
    } catch (error) {
      console.error('Failed to update cart item:', error);
    } finally {
      this.classList.remove('is-loading');
    }
  }

  async renderDrawer() {
    try {
      const response = await fetch(`${window.Shopify?.routes?.root || '/'}?section_id=cart-drawer`);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newDrawerInner = doc.querySelector('.cart-drawer__inner');
      
      if (newDrawerInner && this.inner) {
        this.inner.innerHTML = newDrawerInner.innerHTML;
        this.bindEvents();
      }
    } catch (error) {
      console.error('Failed to re-render cart drawer:', error);
    }
  }
}

customElements.define('cart-drawer', CartDrawer);

// Listen to Product Card quick-add forms globally
document.addEventListener('submit', async (e) => {
  const form = e.target.closest('form[action*="/cart/add"]');
  if (!form) return;

  e.preventDefault();
  const submitButton = form.querySelector('[type="submit"]');
  const originalText = submitButton ? submitButton.innerHTML : '';
  
  if (submitButton) {
    submitButton.setAttribute('disabled', 'disabled');
    submitButton.innerHTML = `<span class="spinner"></span>`;
  }

  try {
    const formData = new FormData(form);
    await window.ShopifyCart.add(formData);
  } catch (err) {
    alert(err.message || 'Could not add item to cart');
  } finally {
    if (submitButton) {
      submitButton.removeAttribute('disabled');
      submitButton.innerHTML = originalText;
    }
  }
});

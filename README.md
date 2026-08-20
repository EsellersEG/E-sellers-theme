# E-sellers Professional (v4.9.0)

> **Theme**: E-sellers Professional  
> **Developer**: E-sellers  
> **Contact**: info@e-sellers.net  
> **Version**: 4.9.0  
> **Architecture**: Shopify Online Store 2.0 (OS 2.0)

A high-performance, conversion-focused, and visually captivating Shopify theme built on the principles of Shopify's **Skeleton Theme**, fully compliant with **Shopify Theme Store Requirements** and **Shopify Theme Best Practices**.

---

## 🎯 Project Vision & Goals

1. **Impact-Grade Visuals & Commerce Power**:
   - Modern, bold aesthetic with smooth micro-interactions.
   - High-converting sales features (AJAX Cart Drawer with free shipping progress bar, Predictive Live Search, Sticky Add to Cart, Color Swatches, Variant Pickers, Quick View).
   - Rich section suite (Marquee/Ticker, Image Banner, Split Sliders, Before/After image comparison, Multicolumn, Accordions, Video Banners).

2. **Per-Section Design Freedom**:
   - Direct, granular color and styling controls inside every section's schema settings (custom backgrounds, text, headings, buttons, gradients) without being forced into restrictive global color presets.

3. **Performance & Standards**:
   - 100% **Online Store 2.0 (OS 2.0)** with JSON templates for all page types.
   - Built with **Vanilla JavaScript Custom Elements (Web Components)** for zero-bloat runtime performance.
   - Optimized asset loading (deferred scripts, critical CSS, responsive `srcset` and `sizes` with smart `eager` / `lazy` image loading).
   - Strict **WCAG 2.1 Level AA Accessibility** compliance (keyboard traps, ARIA roles, focus management, screen-reader support).
   - 100% translatable via localized strings in `locales/en.default.json`.

---

## 📁 Repository Structure

```
├── assets/                    # Scoped CSS, Vanilla JS Web Components, SVG icons
│   ├── base.css               # Core typography, layout grid, CSS custom properties
│   ├── global.js              # Theme utility functions, pub/sub event bus
│   ├── component-cart-drawer.css / .js
│   ├── component-predictive-search.css / .js
│   ├── component-variant-picker.js
│   ├── component-product-gallery.css / .js
│   ├── component-modal.js
│   ├── component-accordion.js
│   ├── section-header.css
│   ├── section-footer.css
│   ├── section-main-product.css
│   └── section-image-banner.css
│
├── config/
│   ├── settings_schema.json   # Global theme settings (Typography, Layout, Cart type, Socials, Favicon)
│   └── settings_data.json     # Default configuration presets
│
├── layout/
│   ├── theme.liquid           # Primary HTML document layout with head tags & SEO schemas
│   └── password.liquid        # Password protection layout
│
├── locales/
│   └── en.default.json        # English locale strings for storefront UI & schema labels
│
├── sections/                  # Online Store 2.0 Dynamic Sections
│   ├── announcement-bar.liquid
│   ├── header.liquid
│   ├── footer.liquid
│   ├── cart-drawer.liquid
│   ├── main-product.liquid
│   ├── main-collection.liquid
│   ├── main-search.liquid
│   ├── main-cart.liquid
│   ├── main-page.liquid
│   ├── main-blog.liquid
│   ├── main-article.liquid
│   ├── main-404.liquid
│   ├── main-password.liquid
│   ├── image-banner.liquid
│   ├── rich-text.liquid
│   ├── featured-collection.liquid
│   ├── multicolumn.liquid
│   ├── marquee-ticker.liquid
│   ├── before-after-slider.liquid
│   ├── collapsible-content.liquid
│   ├── video-banner.liquid
│   ├── contact-form.liquid
│   └── newsletter.liquid
│
├── snippets/                  # Reusable Liquid Snippets
│   ├── card-product.liquid    # Product card with badges, swatches, quick add
│   ├── card-collection.liquid # Collection grid card
│   ├── card-article.liquid    # Blog article card
│   ├── price.liquid           # Regular, sale, unit pricing display
│   ├── icon.liquid            # Clean SVG icon registry
│   ├── buy-buttons.liquid     # Add-to-cart, buy-it-now, dynamic checkout buttons
│   ├── product-variant-picker.liquid # Swatches, dropdowns, pill buttons
│   ├── product-media-gallery.liquid  # Responsive image gallery, zoom, video/3D models
│   ├── schema-structured-data.liquid # JSON-LD for Store, Product, Article, Breadcrumbs
│   ├── pagination.liquid      # Accessible pagination controls
│   └── facet-filters.liquid   # Faceted search & collection filters
│
└── templates/                 # OS 2.0 JSON Templates
    ├── index.json
    ├── product.json
    ├── collection.json
    ├── collection.list.json
    ├── cart.json
    ├── page.json
    ├── page.contact.json
    ├── blog.json
    ├── article.json
    ├── search.json
    ├── 404.json
    ├── password.json
    └── customers/
        ├── login.json
        ├── register.json
        ├── account.json
        ├── addresses.json
        ├── order.json
        ├── reset_password.json
        └── activate_account.json
```

---

## 🛠️ Key Architectural Decisions

### 1. Section Scoped Styling & Dynamic Colors
Every section schema contains dedicated color and layout settings. Colors are dynamically injected at the section wrapper level using CSS custom properties:
```liquid
{%- style -%}
  #shopify-section-{{ section.id }} {
    --section-bg: {{ section.settings.background_color | default: 'transparent' }};
    --section-text: {{ section.settings.text_color | default: 'inherit' }};
    --section-heading: {{ section.settings.heading_color | default: 'inherit' }};
    --section-btn-bg: {{ section.settings.button_bg | default: '#000000' }};
    --section-btn-text: {{ section.settings.button_text | default: '#ffffff' }};
    --section-padding-top: {{ section.settings.padding_top }}px;
    --section-padding-bottom: {{ section.settings.padding_bottom }}px;
  }
{%- endstyle -%}
```

### 2. Native Web Components (Zero External Dependencies)
All interactive storefront UI behaviors are encapsulated in native Custom Elements:
- `<cart-drawer>`: AJAX slide-out cart with subtotal calculation, note field, and dynamic free shipping threshold calculator.
- `<predictive-search>`: Instant search debounced input with keyboard navigation and predictive API suggestions.
- `<variant-picker>`: Real-time price, SKU, availability, swatch, and URL updating without page reloads.
- `<product-media-gallery>`: Touch-friendly slider, thumbnail navigator, and zoom lightbox.
- `<accordion-group>` & `<collapsible-tab>`: Accessible collapsible FAQs and product detail tabs.
- `<marquee-ticker>`: Hardware-accelerated continuous text/icon marquee.

### 3. SEO & Structured Data (JSON-LD)
Native schema markup embedded for:
- Organization & WebSite (`SearchAction`)
- Product schema (Price, Availability, SKU, Brand, Rating/Reviews aggregate)
- Article / BlogPosting schema
- BreadcrumbList schema

---

## 📋 Development Roadmap

- [ ] **Phase 1: Core Foundation & Tokens**
  - Layout (`layout/theme.liquid`, `layout/password.liquid`)
  - Global CSS tokens, reset, typography, grid (`assets/base.css`)
  - Global JS pub/sub event bus & utilities (`assets/global.js`)
  - Global theme settings schema (`config/settings_schema.json`, `config/settings_data.json`)
  - English localization strings (`locales/en.default.json`)

- [ ] **Phase 2: Header, Navigation & Footer**
  - Announcement bar with multi-messages & ticker (`sections/announcement-bar.liquid`)
  - Header with sticky modes, mega-menus, mobile drawer, predictive search trigger (`sections/header.liquid`)
  - Accessible footer with newsletter, menus, payment icons, localization selectors (`sections/footer.liquid`)

- [ ] **Phase 3: High-Converting Commerce Systems**
  - AJAX Cart Drawer (`sections/cart-drawer.liquid`, `assets/component-cart-drawer.js`, `assets/component-cart-drawer.css`)
  - Predictive Search System (`assets/component-predictive-search.js`, `sections/predictive-search.liquid`)
  - Product Card snippet with swatches, quick add, badges (`snippets/card-product.liquid`, `snippets/price.liquid`)

- [ ] **Phase 4: Product & Collection Powerhouse**
  - Main Product Section (`sections/main-product.liquid`, nested OS 2.0 blocks, variant pickers, sticky add-to-cart, media gallery)
  - Main Collection & Search (`sections/main-collection.liquid`, `sections/main-search.liquid`, faceted filtering)

- [ ] **Phase 5: Commercial Impact Marketing Section Suite**
  - Image Banner / Hero (`sections/image-banner.liquid`)
  - Marquee Ticker (`sections/marquee-ticker.liquid`)
  - Featured Collection Grid & Carousel (`sections/featured-collection.liquid`)
  - Multicolumn / Feature Grid (`sections/multicolumn.liquid`)
  - Rich Text & Storytelling (`sections/rich-text.liquid`)
  - Before/After Image Comparison (`sections/before-after-slider.liquid`)
  - Video Banner (`sections/video-banner.liquid`)
  - Collapsible FAQ / Content (`sections/collapsible-content.liquid`)

- [ ] **Phase 6: Templates & Customer Accounts**
  - All OS 2.0 JSON templates (`templates/*.json`)
  - Customer account templates (`templates/customers/*.json`)
  - SEO structured data snippets (`snippets/schema-structured-data.liquid`)

- [ ] **Phase 7: Shopify Theme Store Compliance & Audit**
  - Theme Check linting & validation
  - Lighthouse performance & WCAG 2.1 AA accessibility audit
  - Multi-browser and mobile device verification

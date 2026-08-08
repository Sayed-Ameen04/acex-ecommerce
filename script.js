/* =========================================================
   AceX.in — vanilla JS store logic
   Frontend-only demo: cart & wishlist persist to localStorage.
   No backend, no auth, no real payments.
   ========================================================= */

/* ---------- Icon library (line-art placeholders, no photos needed) ---------- */
const ICONS = {
  headphones: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 55v-8a30 30 0 0 1 60 0v8"/><rect x="14" y="52" width="16" height="26" rx="6"/><rect x="70" y="52" width="16" height="26" rx="6"/></svg>`,
  phone: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="30" y="10" width="40" height="80" rx="8"/><line x1="42" y1="80" x2="58" y2="80"/></svg>`,
  keyboard: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="30" width="80" height="40" rx="5"/><line x1="22" y1="42" x2="22" y2="42.5"/><line x1="34" y1="42" x2="34" y2="42.5"/><line x1="46" y1="42" x2="46" y2="42.5"/><line x1="58" y1="42" x2="58" y2="42.5"/><line x1="70" y1="42" x2="70" y2="42.5"/><line x1="78" y1="42" x2="78" y2="42.5"/><line x1="30" y1="58" x2="70" y2="58"/></svg>`,
  watch: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="32" y="30" width="36" height="40" rx="8"/><path d="M40 30V16h20v14M40 70v14h20V70"/><circle cx="50" cy="50" r="7"/></svg>`,
  speaker: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="28" y="10" width="44" height="80" rx="10"/><circle cx="50" cy="34" r="8"/><circle cx="50" cy="64" r="12"/></svg>`,
  laptop: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="22" width="64" height="42" rx="3"/><path d="M10 76h80l-6-10H16z"/></svg>`,
  camera: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="30" width="76" height="52" rx="6"/><path d="M34 30l6-10h20l6 10"/><circle cx="50" cy="56" r="16"/></svg>`,
  mouse: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="32" y="14" width="36" height="72" rx="18"/><line x1="50" y1="14" x2="50" y2="40"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.1 6.3 7 1-5 4.9 1.2 6.9L12 17.8 5.7 21l1.2-6.9-5-4.9 7-1z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 21s-7.5-4.6-10-9.1C.5 8.4 2 4.8 5.6 4.1 8 3.6 10.3 4.8 12 7c1.7-2.2 4-3.4 6.4-2.9 3.6.7 5.1 4.3 3.6 7.8C19.5 16.4 12 21 12 21z"/></svg>`,
  heartFilled: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.1C.5 8.4 2 4.8 5.6 4.1 8 3.6 10.3 4.8 12 7c1.7-2.2 4-3.4 6.4-2.9 3.6.7 5.1 4.3 3.6 7.8C19.5 16.4 12 21 12 21z"/></svg>`,
};

/* ---------- Product catalog ---------- */
const PRODUCTS = [
  { id: 'ax-au-014', sku: 'AX-AU-014', name: 'AeroPods Pro X2', cat: 'audio', catLabel: 'Audio', price: 149, rating: 4.8, icon: 'headphones',
    spec: '28h battery · ANC · IPX4', desc: 'True-wireless earbuds tuned for long listening sessions, with adaptive noise cancelling and a case that tops up in minutes.',
    specs: { 'Battery life': '28h (case incl.)', 'Noise cancelling': 'Adaptive ANC', 'Water rating': 'IPX4', 'Driver': '11mm dynamic', 'Weight': '5.4g / bud' }, badge: 'Bestseller' },
  { id: 'ax-mb-021', sku: 'AX-MB-021', name: 'Nova13 Ultra', cat: 'mobile', catLabel: 'Mobile', price: 899, rating: 4.6, icon: 'phone',
    spec: '6.7" OLED · 256GB · 5G', desc: 'Flagship phone with a bright 120Hz display, a triple-lens camera system, and all-day battery life.',
    specs: { 'Display': '6.7" OLED 120Hz', 'Storage': '256GB', 'RAM': '12GB', 'Camera': '50MP triple', 'Battery': '5000mAh' } },
  { id: 'ax-kb-007', sku: 'AX-KB-007', name: 'TypeCraft Mechanical', cat: 'computing', catLabel: 'Computing', price: 129, rating: 4.7, icon: 'keyboard',
    spec: 'Hot-swap · Tactile · RGB', desc: 'A hot-swappable mechanical keyboard with tactile switches and per-key RGB, built for people who type all day.',
    specs: { 'Switch type': 'Tactile, hot-swap', 'Layout': '75%', 'Backlight': 'Per-key RGB', 'Connection': 'USB-C / 2.4GHz', 'Keycaps': 'PBT double-shot' } },
  { id: 'ax-wr-033', sku: 'AX-WR-033', name: 'PulseFit Watch S', cat: 'wearable', catLabel: 'Wearable', price: 199, rating: 4.4, icon: 'watch',
    spec: 'GPS · SpO2 · 7-day battery', desc: 'A fitness-first smartwatch with built-in GPS, blood-oxygen tracking, and a battery that actually lasts the week.',
    specs: { 'Battery life': '7 days', 'GPS': 'Built-in', 'Water rating': '5 ATM', 'Display': '1.4" AMOLED', 'Sensors': 'HR, SpO2, accelerometer' } },
  { id: 'ax-au-019', sku: 'AX-AU-019', name: 'SonicSphere Mini', cat: 'audio', catLabel: 'Audio', price: 89, rating: 4.3, icon: 'speaker',
    spec: '360° sound · 12h · IP67', desc: 'A pocketable bluetooth speaker with 360° sound projection and a fully waterproof shell.',
    specs: { 'Output': '20W', 'Battery life': '12h', 'Water rating': 'IP67', 'Connectivity': 'Bluetooth 5.3', 'Weight': '480g' } },
  { id: 'ax-lp-042', sku: 'AX-LP-042', name: 'VoltBook Air 14', cat: 'computing', catLabel: 'Computing', price: 1299, rating: 4.9, icon: 'laptop',
    spec: '14" · 16GB · 1TB SSD', desc: 'A thin-and-light laptop with a full working day of battery, a sharp 14" display, and a fanless chassis.',
    specs: { 'Display': '14" 2.8K 120Hz', 'Memory': '16GB unified', 'Storage': '1TB SSD', 'Battery life': 'Up to 18h', 'Weight': '1.24kg' }, badge: 'New' },
  { id: 'ax-cm-011', sku: 'AX-CM-011', name: 'FrameShot X', cat: 'photo', catLabel: 'Photo', price: 649, rating: 4.5, icon: 'camera',
    spec: '24MP APS-C · 4K60', desc: 'A compact mirrorless camera with a 24MP APS-C sensor and 4K60 video, built for creators on the move.',
    specs: { 'Sensor': '24MP APS-C', 'Video': '4K @ 60fps', 'ISO range': '100–51200', 'Stabilization': '5-axis IBIS', 'Mount': 'AX-E mount' } },
  { id: 'ax-kb-018', sku: 'AX-KB-018', name: 'GlideMouse Pro', cat: 'computing', catLabel: 'Computing', price: 59, rating: 4.2, icon: 'mouse',
    spec: '4000 DPI · 70h · Silent', desc: 'A silent-click wireless mouse with a precise 4000 DPI sensor and a battery that lasts weeks per charge.',
    specs: { 'Sensor': '4000 DPI optical', 'Battery life': '~70h', 'Click type': 'Silent switches', 'Connection': 'USB-C / Bluetooth', 'Weight': '86g' } },
];

const CATEGORIES = ['all', 'audio', 'mobile', 'computing', 'wearable', 'photo'];
const CAT_LABELS = { all: 'All', audio: 'Audio', mobile: 'Mobile', computing: 'Computing', wearable: 'Wearable', photo: 'Photo' };

/* ---------- State ---------- */
let state = {
  category: 'all',
  search: '',
  sort: 'default',
  cart: JSON.parse(localStorage.getItem('acex_cart') || '{}'),
  wishlist: JSON.parse(localStorage.getItem('acex_wishlist') || '[]'),
};

function saveState(){
  localStorage.setItem('acex_cart', JSON.stringify(state.cart));
  localStorage.setItem('acex_wishlist', JSON.stringify(state.wishlist));
}

/* ---------- Helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const money = (n) => `$${n.toFixed(2)}`;
const findProduct = (id) => PRODUCTS.find(p => p.id === id);
const isAudioDiscount = (p) => p.cat === 'audio';

function starRow(rating){
  return `${ICONS.star}<span>${rating.toFixed(1)}</span>`;
}

/* ---------- Render: chips ---------- */
function renderChips(){
  const row = $('#chipRow');
  row.innerHTML = CATEGORIES.map(c =>
    `<button class="chip ${state.category === c ? 'active' : ''}" data-cat="${c}" role="tab" aria-selected="${state.category === c}">${CAT_LABELS[c]}</button>`
  ).join('');
  row.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      state.category = chip.dataset.cat;
      renderChips();
      renderGrid();
    });
  });
}

/* ---------- Render: product grid ---------- */
function getFiltered(){
  let list = PRODUCTS.filter(p => {
    const matchCat = state.category === 'all' || p.cat === state.category;
    const q = state.search.trim().toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.catLabel.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
  switch(state.sort){
    case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
    case 'rating-desc': list.sort((a,b)=>b.rating-a.rating); break;
    case 'name-asc': list.sort((a,b)=>a.name.localeCompare(b.name)); break;
  }
  return list;
}

function renderGrid(){
  const grid = $('#productGrid');
  const list = getFiltered();
  $('#resultCount').textContent = `${list.length} product${list.length !== 1 ? 's' : ''} on the sheet`;
  $('#emptyState').hidden = list.length !== 0;

  grid.innerHTML = list.map(p => {
    const inWishlist = state.wishlist.includes(p.id);
    const lowStockBadge = p.badge ? `<span class="card-badge ${p.badge === 'New' ? '' : ''}">${p.badge}</span>` : '';
    return `
    <article class="product-card" data-id="${p.id}">
      <div class="card-media">
        <span class="card-sku mono">${p.sku}</span>
        <button class="card-wish ${inWishlist ? 'active' : ''}" data-wish="${p.id}" aria-label="Toggle wishlist">
          ${inWishlist ? ICONS.heartFilled : ICONS.heart}
        </button>
        ${ICONS[p.icon]}
        ${lowStockBadge}
      </div>
      <div class="card-body">
        <span class="card-cat">${p.catLabel}</span>
        <h3 class="card-name" data-view="${p.id}">${p.name}</h3>
        <p class="card-spec mono">${p.spec}</p>
        <div class="card-rating">${starRow(p.rating)}</div>
        <div class="card-foot">
          <span class="card-price mono">${money(p.price)}</span>
          <button class="card-add" data-add="${p.id}" aria-label="Add to cart">${ICONS.plus}</button>
        </div>
      </div>
    </article>`;
  }).join('');

  // reveal-in animation
  requestAnimationFrame(() => {
    grid.querySelectorAll('.product-card').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), i * 40);
    });
  });

  grid.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(btn.dataset.add);
      btn.classList.add('added');
      btn.innerHTML = ICONS.check;
      setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = ICONS.plus; }, 900);
    });
  });
  grid.querySelectorAll('[data-wish]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(btn.dataset.wish);
    });
  });
  grid.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', () => openModal(el.dataset.view));
  });
}

/* ---------- Cart logic ---------- */
function addToCart(id){
  state.cart[id] = (state.cart[id] || 0) + 1;
  saveState();
  updateCounts();
  renderDrawer();
  const p = findProduct(id);
  showToast(`${p.name} added to cart`);
}
function setQty(id, qty){
  if(qty <= 0){ delete state.cart[id]; } else { state.cart[id] = qty; }
  saveState();
  updateCounts();
  renderDrawer();
}
function removeFromCart(id){
  delete state.cart[id];
  saveState();
  updateCounts();
  renderDrawer();
}

function cartTotals(){
  let subtotal = 0, discount = 0, hasAudio = false;
  Object.entries(state.cart).forEach(([id, qty]) => {
    const p = findProduct(id);
    if(!p) return;
    const lineTotal = p.price * qty;
    subtotal += lineTotal;
    if(isAudioDiscount(p)){ discount += lineTotal * 0.15; hasAudio = true; }
  });
  return { subtotal, discount, total: subtotal - discount, hasAudio };
}

function renderDrawer(){
  const items = $('#drawerItems');
  const entries = Object.entries(state.cart);
  if(entries.length === 0){
    items.innerHTML = `<p class="drawer-empty">Cart's empty. Go find something with a good spec sheet.</p>`;
  } else {
    items.innerHTML = entries.map(([id, qty]) => {
      const p = findProduct(id);
      if(!p) return '';
      return `
      <div class="drawer-item" data-item="${id}">
        <div class="drawer-item-media">${ICONS[p.icon]}</div>
        <div class="drawer-item-info">
          <p class="drawer-item-name">${p.name}</p>
          <p class="drawer-item-sku mono">${p.sku}</p>
          <div class="drawer-item-row">
            <div class="qty-control">
              <button data-dec="${id}" aria-label="Decrease quantity">−</button>
              <span class="mono">${qty}</span>
              <button data-inc="${id}" aria-label="Increase quantity">+</button>
            </div>
            <span class="drawer-item-price mono">${money(p.price * qty)}</span>
          </div>
          <button class="drawer-remove" data-remove="${id}">Remove</button>
        </div>
      </div>`;
    }).join('');
  }

  const { subtotal, discount, total, hasAudio } = cartTotals();
  $('#cartSubtotal').textContent = money(subtotal);
  $('#cartTotal').textContent = money(total);
  $('#cartDiscount').textContent = `−${money(discount)}`;
  $('#dealRow').hidden = !hasAudio;

  items.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => setQty(b.dataset.inc, (state.cart[b.dataset.inc]||0)+1)));
  items.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => setQty(b.dataset.dec, (state.cart[b.dataset.dec]||0)-1)));
  items.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => removeFromCart(b.dataset.remove)));
}

/* ---------- Wishlist ---------- */
function toggleWishlist(id){
  const idx = state.wishlist.indexOf(id);
  if(idx > -1){ state.wishlist.splice(idx, 1); } else { state.wishlist.push(id); }
  saveState();
  updateCounts();
  renderGrid();
}

/* ---------- Counts ---------- */
function updateCounts(){
  const cartCount = Object.values(state.cart).reduce((a,b)=>a+b, 0);
  const wishCount = state.wishlist.length;
  const cartBadge = $('#cartCount');
  const wishBadge = $('#wishlistCount');
  const drawerCount = $('#drawerCount');
  cartBadge.textContent = cartCount;
  wishBadge.textContent = wishCount;
  drawerCount.textContent = `(${cartCount})`;
  cartBadge.classList.toggle('show', cartCount > 0);
  wishBadge.classList.toggle('show', wishCount > 0);
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg){
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

/* ---------- Quick view modal ---------- */
function openModal(id){
  const p = findProduct(id);
  if(!p) return;
  $('#modalBody').innerHTML = `
    <div class="modal-grid">
      <div class="modal-media">${ICONS[p.icon]}</div>
      <div>
        <p class="modal-sku mono">${p.sku}</p>
        <h2 class="modal-title" id="modalTitle">${p.name}</h2>
        <p class="modal-price mono">${money(p.price)}</p>
        <p class="modal-desc">${p.desc}</p>
        <table class="spec-table">
          ${Object.entries(p.specs).map(([k,v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
        </table>
        <button class="btn btn-primary btn-block" data-modal-add="${p.id}">Add to cart · ${money(p.price)}</button>
      </div>
    </div>`;
  $('#modalOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
  $('[data-modal-add]').addEventListener('click', () => {
    addToCart(p.id);
    closeModal();
  });
}
function closeModal(){
  $('#modalOverlay').classList.remove('show');
  document.body.style.overflow = '';
}

/* ---------- Cart drawer open/close ---------- */
function openCart(){
  $('#cartDrawer').classList.add('open');
  $('#drawerOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeCart(){
  $('#cartDrawer').classList.remove('open');
  $('#drawerOverlay').classList.remove('show');
  document.body.style.overflow = '';
}

/* ---------- Mobile nav ---------- */
function toggleMobileNav(){
  const links = $('#navLinks');
  const search = $('.nav-search');
  const btn = $('#hamburger');
  const open = links.classList.toggle('mobile-open');
  search.classList.toggle('mobile-open', open);
  btn.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
}

/* ---------- Reveal on scroll ---------- */
function initReveal(){
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  $$('.reveal').forEach(el => obs.observe(el));
}

/* ---------- Hero stats ---------- */
function initHeroStats(){
  const cats = new Set(PRODUCTS.map(p => p.cat)).size;
  const avgRating = (PRODUCTS.reduce((a,p) => a + p.rating, 0) / PRODUCTS.length).toFixed(1);
  animateCount('#statSkus', PRODUCTS.length);
  animateCount('#statCats', cats);
  $('#statRating').textContent = avgRating;
}
function animateCount(sel, target){
  const el = $(sel);
  let cur = 0;
  const step = Math.max(1, Math.ceil(target / 20));
  const t = setInterval(() => {
    cur += step;
    if(cur >= target){ cur = target; clearInterval(t); }
    el.textContent = cur;
  }, 40);
}

/* ---------- Nav shadow on scroll ---------- */
function initNavScroll(){
  const nav = $('#navbar');
  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = window.scrollY > 8 ? 'var(--border)' : 'transparent';
  });
}

/* ---------- Events ---------- */
function bindEvents(){
  $('#searchInput').addEventListener('input', (e) => {
    state.search = e.target.value;
    renderGrid();
  });
  $('#sortSelect').addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderGrid();
  });
  $('#cartBtn').addEventListener('click', openCart);
  $('#closeCart').addEventListener('click', closeCart);
  $('#drawerOverlay').addEventListener('click', closeCart);
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalOverlay').addEventListener('click', (e) => { if(e.target.id === 'modalOverlay') closeModal(); });
  $('#hamburger').addEventListener('click', toggleMobileNav);
  $('#wishlistBtn').addEventListener('click', () => {
    state.category = 'all';
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    showToast(state.wishlist.length ? `${state.wishlist.length} item(s) wishlisted` : 'Wishlist is empty');
  });
  $('#dealsBtn').addEventListener('click', (e) => {
    e.preventDefault();
    state.category = 'audio';
    renderChips();
    renderGrid();
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
  });
  $('#checkoutBtn').addEventListener('click', () => {
    if(Object.keys(state.cart).length === 0){ showToast('Cart is empty'); return; }
    showToast('Demo checkout — no real payment was processed');
  });
  $('#newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thanks — this is a demo, no email was sent');
    e.target.reset();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){ closeCart(); closeModal(); }
  });
  // close mobile nav after clicking a link
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
    if($('#navLinks').classList.contains('mobile-open')) toggleMobileNav();
  }));
}

/* ---------- Init ---------- */
function init(){
  renderChips();
  renderGrid();
  renderDrawer();
  updateCounts();
  bindEvents();
  initReveal();
  initHeroStats();
  initNavScroll();
}
document.addEventListener('DOMContentLoaded', init);


/* =========================================================
   AceX.in — vanilla JS store logic
   Frontend-only demo: cart & wishlist persist to localStorage.
   No backend, no auth, no real payments.
   ========================================================= */

/* ---------- Icon library (line-art placeholders, no photos needed) ---------- */
const ICONS = {
  headphones: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 55v-8a30 30 0 0 1 60 0v8"/><rect x="14" y="52" width="16" height="26" rx="6"/><rect x="70" y="52" width="16" height="26" rx="6"/></svg>`,
  phone: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="30" y="10" width="40" height="80" rx="8"/><line x1="42" y1="80" x2="58" y2="80"/></svg>`,
  keyboard: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="30" width="80" height="40" rx="5"/><line x1="22" y1="42" x2="22" y2="42.5"/><line x1="34" y1="42" x2="34" y2="42.5"/><line x1="46" y1="42" x2="46" y2="42.5"/><line x1="58" y1="42" x2="58" y2="42.5"/><line x1="70" y1="42" x2="70" y2="42.5"/><line x1="78" y1="42" x2="78" y2="42.5"/><line x1="30" y1="58" x2="70" y2="58"/></svg>`,
  watch: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="32" y="30" width="36" height="40" rx="8"/><path d="M40 30V16h20v14M40 70v14h20V70"/><circle cx="50" cy="50" r="7"/></svg>`,
  speaker: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="28" y="10" width="44" height="80" rx="10"/><circle cx="50" cy="34" r="8"/><circle cx="50" cy="64" r="12"/></svg>`,
  laptop: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="22" width="64" height="42" rx="3"/><path d="M10 76h80l-6-10H16z"/></svg>`,
  camera: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="30" width="76" height="52" rx="6"/><path d="M34 30l6-10h20l6 10"/><circle cx="50" cy="56" r="16"/></svg>`,
  mouse: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="32" y="14" width="36" height="72" rx="18"/><line x1="50" y1="14" x2="50" y2="40"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.1 6.3 7 1-5 4.9 1.2 6.9L12 17.8 5.7 21l1.2-6.9-5-4.9 7-1z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 21s-7.5-4.6-10-9.1C.5 8.4 2 4.8 5.6 4.1 8 3.6 10.3 4.8 12 7c1.7-2.2 4-3.4 6.4-2.9 3.6.7 5.1 4.3 3.6 7.8C19.5 16.4 12 21 12 21z"/></svg>`,
  heartFilled: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.1C.5 8.4 2 4.8 5.6 4.1 8 3.6 10.3 4.8 12 7c1.7-2.2 4-3.4 6.4-2.9 3.6.7 5.1 4.3 3.6 7.8C19.5 16.4 12 21 12 21z"/></svg>`,
};

/* ---------- Product catalog ---------- */
const PRODUCTS = [
  { id: 'ax-au-014', sku: 'AX-AU-014', name: 'AeroPods Pro X2', cat: 'audio', catLabel: 'Audio', price: 149, rating: 4.8, icon: 'headphones',
    spec: '28h battery · ANC · IPX4', desc: 'True-wireless earbuds tuned for long listening sessions, with adaptive noise cancelling and a case that tops up in minutes.',
    specs: { 'Battery life': '28h (case incl.)', 'Noise cancelling': 'Adaptive ANC', 'Water rating': 'IPX4', 'Driver': '11mm dynamic', 'Weight': '5.4g / bud' }, badge: 'Bestseller' },
  { id: 'ax-mb-021', sku: 'AX-MB-021', name: 'Nova13 Ultra', cat: 'mobile', catLabel: 'Mobile', price: 899, rating: 4.6, icon: 'phone',
    spec: '6.7" OLED · 256GB · 5G', desc: 'Flagship phone with a bright 120Hz display, a triple-lens camera system, and all-day battery life.',
    specs: { 'Display': '6.7" OLED 120Hz', 'Storage': '256GB', 'RAM': '12GB', 'Camera': '50MP triple', 'Battery': '5000mAh' } },
  { id: 'ax-kb-007', sku: 'AX-KB-007', name: 'TypeCraft Mechanical', cat: 'computing', catLabel: 'Computing', price: 129, rating: 4.7, icon: 'keyboard',
    spec: 'Hot-swap · Tactile · RGB', desc: 'A hot-swappable mechanical keyboard with tactile switches and per-key RGB, built for people who type all day.',
    specs: { 'Switch type': 'Tactile, hot-swap', 'Layout': '75%', 'Backlight': 'Per-key RGB', 'Connection': 'USB-C / 2.4GHz', 'Keycaps': 'PBT double-shot' } },
  { id: 'ax-wr-033', sku: 'AX-WR-033', name: 'PulseFit Watch S', cat: 'wearable', catLabel: 'Wearable', price: 199, rating: 4.4, icon: 'watch',
    spec: 'GPS · SpO2 · 7-day battery', desc: 'A fitness-first smartwatch with built-in GPS, blood-oxygen tracking, and a battery that actually lasts the week.',
    specs: { 'Battery life': '7 days', 'GPS': 'Built-in', 'Water rating': '5 ATM', 'Display': '1.4" AMOLED', 'Sensors': 'HR, SpO2, accelerometer' } },
  { id: 'ax-au-019', sku: 'AX-AU-019', name: 'SonicSphere Mini', cat: 'audio', catLabel: 'Audio', price: 89, rating: 4.3, icon: 'speaker',
    spec: '360° sound · 12h · IP67', desc: 'A pocketable bluetooth speaker with 360° sound projection and a fully waterproof shell.',
    specs: { 'Output': '20W', 'Battery life': '12h', 'Water rating': 'IP67', 'Connectivity': 'Bluetooth 5.3', 'Weight': '480g' } },
  { id: 'ax-lp-042', sku: 'AX-LP-042', name: 'VoltBook Air 14', cat: 'computing', catLabel: 'Computing', price: 1299, rating: 4.9, icon: 'laptop',
    spec: '14" · 16GB · 1TB SSD', desc: 'A thin-and-light laptop with a full working day of battery, a sharp 14" display, and a fanless chassis.',
    specs: { 'Display': '14" 2.8K 120Hz', 'Memory': '16GB unified', 'Storage': '1TB SSD', 'Battery life': 'Up to 18h', 'Weight': '1.24kg' }, badge: 'New' },
  { id: 'ax-cm-011', sku: 'AX-CM-011', name: 'FrameShot X', cat: 'photo', catLabel: 'Photo', price: 649, rating: 4.5, icon: 'camera',
    spec: '24MP APS-C · 4K60', desc: 'A compact mirrorless camera with a 24MP APS-C sensor and 4K60 video, built for creators on the move.',
    specs: { 'Sensor': '24MP APS-C', 'Video': '4K @ 60fps', 'ISO range': '100–51200', 'Stabilization': '5-axis IBIS', 'Mount': 'AX-E mount' } },
  { id: 'ax-kb-018', sku: 'AX-KB-018', name: 'GlideMouse Pro', cat: 'computing', catLabel: 'Computing', price: 59, rating: 4.2, icon: 'mouse',
    spec: '4000 DPI · 70h · Silent', desc: 'A silent-click wireless mouse with a precise 4000 DPI sensor and a battery that lasts weeks per charge.',
    specs: { 'Sensor': '4000 DPI optical', 'Battery life': '~70h', 'Click type': 'Silent switches', 'Connection': 'USB-C / Bluetooth', 'Weight': '86g' } },
];

const CATEGORIES = ['all', 'audio', 'mobile', 'computing', 'wearable', 'photo'];
const CAT_LABELS = { all: 'All', audio: 'Audio', mobile: 'Mobile', computing: 'Computing', wearable: 'Wearable', photo: 'Photo' };

/* ---------- State ---------- */
let state = {
  category: 'all',
  search: '',
  sort: 'default',
  cart: JSON.parse(localStorage.getItem('acex_cart') || '{}'),
  wishlist: JSON.parse(localStorage.getItem('acex_wishlist') || '[]'),
};

function saveState(){
  localStorage.setItem('acex_cart', JSON.stringify(state.cart));
  localStorage.setItem('acex_wishlist', JSON.stringify(state.wishlist));
}

/* ---------- Helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const money = (n) => `$${n.toFixed(2)}`;
const findProduct = (id) => PRODUCTS.find(p => p.id === id);
const isAudioDiscount = (p) => p.cat === 'audio';

function starRow(rating){
  return `${ICONS.star}<span>${rating.toFixed(1)}</span>`;
}

/* ---------- Render: chips ---------- */
function renderChips(){
  const row = $('#chipRow');
  row.innerHTML = CATEGORIES.map(c =>
    `<button class="chip ${state.category === c ? 'active' : ''}" data-cat="${c}" role="tab" aria-selected="${state.category === c}">${CAT_LABELS[c]}</button>`
  ).join('');
  row.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      state.category = chip.dataset.cat;
      renderChips();
      renderGrid();
    });
  });
}

/* ---------- Render: product grid ---------- */
function getFiltered(){
  let list = PRODUCTS.filter(p => {
    const matchCat = state.category === 'all' || p.cat === state.category;
    const q = state.search.trim().toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.catLabel.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
  switch(state.sort){
    case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
    case 'rating-desc': list.sort((a,b)=>b.rating-a.rating); break;
    case 'name-asc': list.sort((a,b)=>a.name.localeCompare(b.name)); break;
  }
  return list;
}

function renderGrid(){
  const grid = $('#productGrid');
  const list = getFiltered();
  $('#resultCount').textContent = `${list.length} product${list.length !== 1 ? 's' : ''} on the sheet`;
  $('#emptyState').hidden = list.length !== 0;

  grid.innerHTML = list.map(p => {
    const inWishlist = state.wishlist.includes(p.id);
    const lowStockBadge = p.badge ? `<span class="card-badge ${p.badge === 'New' ? '' : ''}">${p.badge}</span>` : '';
    return `
    <article class="product-card" data-id="${p.id}">
      <div class="card-media">
        <span class="card-sku mono">${p.sku}</span>
        <button class="card-wish ${inWishlist ? 'active' : ''}" data-wish="${p.id}" aria-label="Toggle wishlist">
          ${inWishlist ? ICONS.heartFilled : ICONS.heart}
        </button>
        ${ICONS[p.icon]}
        ${lowStockBadge}
      </div>
      <div class="card-body">
        <span class="card-cat">${p.catLabel}</span>
        <h3 class="card-name" data-view="${p.id}">${p.name}</h3>
        <p class="card-spec mono">${p.spec}</p>
        <div class="card-rating">${starRow(p.rating)}</div>
        <div class="card-foot">
          <span class="card-price mono">${money(p.price)}</span>
          <button class="card-add" data-add="${p.id}" aria-label="Add to cart">${ICONS.plus}</button>
        </div>
      </div>
    </article>`;
  }).join('');

  // reveal-in animation
  requestAnimationFrame(() => {
    grid.querySelectorAll('.product-card').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), i * 40);
    });
  });

  grid.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(btn.dataset.add);
      btn.classList.add('added');
      btn.innerHTML = ICONS.check;
      setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = ICONS.plus; }, 900);
    });
  });
  grid.querySelectorAll('[data-wish]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(btn.dataset.wish);
    });
  });
  grid.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', () => openModal(el.dataset.view));
  });
}

/* ---------- Cart logic ---------- */
function addToCart(id){
  state.cart[id] = (state.cart[id] || 0) + 1;
  saveState();
  updateCounts();
  renderDrawer();
  const p = findProduct(id);
  showToast(`${p.name} added to cart`);
}
function setQty(id, qty){
  if(qty <= 0){ delete state.cart[id]; } else { state.cart[id] = qty; }
  saveState();
  updateCounts();
  renderDrawer();
}
function removeFromCart(id){
  delete state.cart[id];
  saveState();
  updateCounts();
  renderDrawer();
}

function cartTotals(){
  let subtotal = 0, discount = 0, hasAudio = false;
  Object.entries(state.cart).forEach(([id, qty]) => {
    const p = findProduct(id);
    if(!p) return;
    const lineTotal = p.price * qty;
    subtotal += lineTotal;
    if(isAudioDiscount(p)){ discount += lineTotal * 0.15; hasAudio = true; }
  });
  return { subtotal, discount, total: subtotal - discount, hasAudio };
}

function renderDrawer(){
  const items = $('#drawerItems');
  const entries = Object.entries(state.cart);
  if(entries.length === 0){
    items.innerHTML = `<p class="drawer-empty">Cart's empty. Go find something with a good spec sheet.</p>`;
  } else {
    items.innerHTML = entries.map(([id, qty]) => {
      const p = findProduct(id);
      if(!p) return '';
      return `
      <div class="drawer-item" data-item="${id}">
        <div class="drawer-item-media">${ICONS[p.icon]}</div>
        <div class="drawer-item-info">
          <p class="drawer-item-name">${p.name}</p>
          <p class="drawer-item-sku mono">${p.sku}</p>
          <div class="drawer-item-row">
            <div class="qty-control">
              <button data-dec="${id}" aria-label="Decrease quantity">−</button>
              <span class="mono">${qty}</span>
              <button data-inc="${id}" aria-label="Increase quantity">+</button>
            </div>
            <span class="drawer-item-price mono">${money(p.price * qty)}</span>
          </div>
          <button class="drawer-remove" data-remove="${id}">Remove</button>
        </div>
      </div>`;
    }).join('');
  }

  const { subtotal, discount, total, hasAudio } = cartTotals();
  $('#cartSubtotal').textContent = money(subtotal);
  $('#cartTotal').textContent = money(total);
  $('#cartDiscount').textContent = `−${money(discount)}`;
  $('#dealRow').hidden = !hasAudio;

  items.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => setQty(b.dataset.inc, (state.cart[b.dataset.inc]||0)+1)));
  items.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => setQty(b.dataset.dec, (state.cart[b.dataset.dec]||0)-1)));
  items.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => removeFromCart(b.dataset.remove)));
}

/* ---------- Wishlist ---------- */
function toggleWishlist(id){
  const idx = state.wishlist.indexOf(id);
  if(idx > -1){ state.wishlist.splice(idx, 1); } else { state.wishlist.push(id); }
  saveState();
  updateCounts();
  renderGrid();
}

/* ---------- Counts ---------- */
function updateCounts(){
  const cartCount = Object.values(state.cart).reduce((a,b)=>a+b, 0);
  const wishCount = state.wishlist.length;
  const cartBadge = $('#cartCount');
  const wishBadge = $('#wishlistCount');
  const drawerCount = $('#drawerCount');
  cartBadge.textContent = cartCount;
  wishBadge.textContent = wishCount;
  drawerCount.textContent = `(${cartCount})`;
  cartBadge.classList.toggle('show', cartCount > 0);
  wishBadge.classList.toggle('show', wishCount > 0);
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg){
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

/* ---------- Quick view modal ---------- */
function openModal(id){
  const p = findProduct(id);
  if(!p) return;
  $('#modalBody').innerHTML = `
    <div class="modal-grid">
      <div class="modal-media">${ICONS[p.icon]}</div>
      <div>
        <p class="modal-sku mono">${p.sku}</p>
        <h2 class="modal-title" id="modalTitle">${p.name}</h2>
        <p class="modal-price mono">${money(p.price)}</p>
        <p class="modal-desc">${p.desc}</p>
        <table class="spec-table">
          ${Object.entries(p.specs).map(([k,v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
        </table>
        <button class="btn btn-primary btn-block" data-modal-add="${p.id}">Add to cart · ${money(p.price)}</button>
      </div>
    </div>`;
  $('#modalOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
  $('[data-modal-add]').addEventListener('click', () => {
    addToCart(p.id);
    closeModal();
  });
}
function closeModal(){
  $('#modalOverlay').classList.remove('show');
  document.body.style.overflow = '';
}

/* ---------- Cart drawer open/close ---------- */
function openCart(){
  $('#cartDrawer').classList.add('open');
  $('#drawerOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeCart(){
  $('#cartDrawer').classList.remove('open');
  $('#drawerOverlay').classList.remove('show');
  document.body.style.overflow = '';
}

/* ---------- Mobile nav ---------- */
function toggleMobileNav(){
  const links = $('#navLinks');
  const search = $('.nav-search');
  const btn = $('#hamburger');
  const open = links.classList.toggle('mobile-open');
  search.classList.toggle('mobile-open', open);
  btn.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
}

/* ---------- Reveal on scroll ---------- */
function initReveal(){
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  $$('.reveal').forEach(el => obs.observe(el));
}

/* ---------- Hero stats ---------- */
function initHeroStats(){
  const cats = new Set(PRODUCTS.map(p => p.cat)).size;
  const avgRating = (PRODUCTS.reduce((a,p) => a + p.rating, 0) / PRODUCTS.length).toFixed(1);
  animateCount('#statSkus', PRODUCTS.length);
  animateCount('#statCats', cats);
  $('#statRating').textContent = avgRating;
}
function animateCount(sel, target){
  const el = $(sel);
  let cur = 0;
  const step = Math.max(1, Math.ceil(target / 20));
  const t = setInterval(() => {
    cur += step;
    if(cur >= target){ cur = target; clearInterval(t); }
    el.textContent = cur;
  }, 40);
}

/* ---------- Nav shadow on scroll ---------- */
function initNavScroll(){
  const nav = $('#navbar');
  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = window.scrollY > 8 ? 'var(--border)' : 'transparent';
  });
}

/* ---------- Events ---------- */
function bindEvents(){
  $('#searchInput').addEventListener('input', (e) => {
    state.search = e.target.value;
    renderGrid();
  });
  $('#sortSelect').addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderGrid();
  });
  $('#cartBtn').addEventListener('click', openCart);
  $('#closeCart').addEventListener('click', closeCart);
  $('#drawerOverlay').addEventListener('click', closeCart);
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalOverlay').addEventListener('click', (e) => { if(e.target.id === 'modalOverlay') closeModal(); });
  $('#hamburger').addEventListener('click', toggleMobileNav);
  $('#wishlistBtn').addEventListener('click', () => {
    state.category = 'all';
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    showToast(state.wishlist.length ? `${state.wishlist.length} item(s) wishlisted` : 'Wishlist is empty');
  });
  $('#dealsBtn').addEventListener('click', (e) => {
    e.preventDefault();
    state.category = 'audio';
    renderChips();
    renderGrid();
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
  });
  $('#checkoutBtn').addEventListener('click', () => {
    if(Object.keys(state.cart).length === 0){ showToast('Cart is empty'); return; }
    showToast('Demo checkout — no real payment was processed');
  });
  $('#newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thanks — this is a demo, no email was sent');
    e.target.reset();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){ closeCart(); closeModal(); }
  });
  // close mobile nav after clicking a link
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
    if($('#navLinks').classList.contains('mobile-open')) toggleMobileNav();
  }));
}

/* ---------- Init ---------- */
function init(){
  renderChips();
  renderGrid();
  renderDrawer();
  updateCounts();
  bindEvents();
  initReveal();
  initHeroStats();
  initNavScroll();
}
document.addEventListener('DOMContentLoaded', init);



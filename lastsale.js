/* ============================================================
   LASTSALE.COM — Main JavaScript
   ============================================================ */

/* ── DATA ── */
const LISTINGS = [
  {
    id: 1,
    title: "Nike Air Force 1 '07",
    cat: "fashion",
    price: 120,
    oldPrice: 200,
    location: "Melbourne, VIC",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    badge: "hot",
    desc: "Classic white leather AF1s. Worn twice. Size US 10.",
    seller: "Jordan K.",
    rating: 4.9,
    reviews: 128,
    condition: "Like New"
  },
  {
    id: 2,
    title: "Sony WH-1000XM5 Headphones",
    cat: "electronics",
    price: 299,
    oldPrice: 450,
    location: "Sydney, NSW",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    badge: "sale",
    desc: "Industry leading noise cancellation, barely used.",
    seller: "Tech Resale AU",
    rating: 5.0,
    reviews: 67,
    condition: "Like New"
  },
  {
    id: 3,
    title: "Vintage Leather Sofa",
    cat: "home",
    price: 680,
    location: "Brisbane, QLD",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    badge: "new",
    desc: "Beautiful tan leather, perfect aged patina. 3-seater.",
    seller: "Emily R.",
    rating: 4.7,
    reviews: 22,
    condition: "Good"
  },
  {
    id: 4,
    title: "Levi's 501 Original Jeans",
    cat: "fashion",
    price: 65,
    oldPrice: 120,
    location: "Adelaide, SA",
    img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
    badge: null,
    desc: "Vintage 90s 501s, W32 L32, slight wear on knees.",
    seller: "Thrift.AU",
    rating: 4.6,
    reviews: 211,
    condition: "Good"
  },
  {
    id: 5,
    title: 'MacBook Air M2 13"',
    cat: "electronics",
    price: 1350,
    oldPrice: 1799,
    location: "Melbourne, VIC",
    img: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&q=80",
    badge: "hot",
    desc: "2023 model, Midnight colour, 8GB/256GB. AppleCare until 2025.",
    seller: "GadgetFlip",
    rating: 4.8,
    reviews: 44,
    condition: "Like New"
  },
  {
    id: 6,
    title: "Fjällräven Kånken Backpack",
    cat: "fashion",
    price: 89,
    location: "Perth, WA",
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    badge: "new",
    desc: "Deep red, one zipper slightly sticky otherwise perfect.",
    seller: "Mia L.",
    rating: 4.5,
    reviews: 17,
    condition: "Good"
  },
  {
    id: 7,
    title: "Vintage Record Player",
    cat: "music",
    price: 195,
    location: "Hobart, TAS",
    img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&q=80",
    badge: null,
    desc: "1970s turntable, serviced last year. Plays 33s and 45s.",
    seller: "VinylVault",
    rating: 4.9,
    reviews: 56,
    condition: "Good"
  },
  {
    id: 8,
    title: "Giant Talon Mountain Bike",
    cat: "sports",
    price: 440,
    oldPrice: 750,
    location: "Canberra, ACT",
    img: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=80",
    badge: "sale",
    desc: "M frame, 21-speed, recently tuned. New tyres fitted.",
    seller: "RidersAU",
    rating: 4.7,
    reviews: 34,
    condition: "Good"
  }
];

/* ── STATE ── */
let favorites  = new Set();
let activeCat  = 'all';
let searchQuery = '';

/* ══════════════════════════════════════
   RENDER LISTINGS
══════════════════════════════════════ */
function renderListings(items) {
  const grid = document.getElementById('listings');
  document.getElementById('listingCount').textContent =
    `Showing ${items.length} item${items.length !== 1 ? 's' : ''}`;

  grid.innerHTML = items.map((item, i) => `
    <div class="listing-card" style="animation-delay:${i * 0.05}s" onclick="openProduct(${item.id})">
      <div class="card-img-wrap">
        <img src="${item.img}" alt="${item.title}" loading="lazy">
        ${item.badge
          ? `<span class="card-badge ${item.badge}">${
              item.badge === 'hot' ? 'HOT' :
              item.badge === 'new' ? 'NEW' : 'SALE'
            }</span>`
          : ''}
        <button
          class="card-fav ${favorites.has(item.id) ? 'active' : ''}"
          onclick="event.stopPropagation(); toggleFav(${item.id}, this)"
          aria-label="Save to favourites">
          ${favorites.has(item.id) ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="card-body">
        <div class="card-title">${item.title}</div>
        <div class="card-meta">📍 ${item.location} · ${item.condition}</div>
        <div class="card-price-row">
          <div>
            <span class="card-price">$${item.price}</span>
            ${item.oldPrice
              ? `<span class="card-price-old">$${item.oldPrice}</span>`
              : ''}
          </div>
          <div class="card-stars">
            ${'★'.repeat(Math.round(item.rating))}${'☆'.repeat(5 - Math.round(item.rating))}
            <span>(${item.reviews})</span>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <span class="card-seller">by ${item.seller}</span>
        <button class="card-add-btn"
          onclick="event.stopPropagation(); showToast('💬 Opening chat…'); setTimeout(toggleChat, 400)">
          Contact
        </button>
      </div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════
   FILTERING & SORTING
══════════════════════════════════════ */
function getFiltered() {
  const minP = document.getElementById('minPrice').value;
  const maxP = document.getElementById('maxPrice').value;
  return LISTINGS.filter(item => {
    const catMatch    = activeCat === 'all' || item.cat === activeCat;
    const searchMatch = !searchQuery ||
      item.title.toLowerCase().includes(searchQuery) ||
      item.location.toLowerCase().includes(searchQuery);
    const priceMatch  = (!minP || item.price >= +minP) && (!maxP || item.price <= +maxP);
    return catMatch && searchMatch && priceMatch;
  });
}

function filterCat(el, cat) {
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  activeCat = cat;
  renderListings(getFiltered());
}

function handleSearch(val) {
  searchQuery = val.toLowerCase();
  renderListings(getFiltered());
}

function applyFilters() {
  renderListings(getFiltered());
  showToast('✓ Filters applied');
}

function sortListings(val) {
  const items = [...getFiltered()];
  if (val === 'price-asc')  items.sort((a, b) => a.price - b.price);
  else if (val === 'price-desc') items.sort((a, b) => b.price - a.price);
  else if (val === 'rating')     items.sort((a, b) => b.rating - a.rating);
  renderListings(items);
}

/* ══════════════════════════════════════
   FAVOURITES
══════════════════════════════════════ */
function toggleFav(id, btn) {
  if (favorites.has(id)) {
    favorites.delete(id);
    btn.textContent = '🤍';
    btn.classList.remove('active');
    showToast('Removed from saved');
  } else {
    favorites.add(id);
    btn.textContent = '❤️';
    btn.classList.add('active');
    showToast('❤️ Saved to favourites');
  }
  document.getElementById('favBadge').textContent = favorites.size;
}

function toggleFavFromModal(id, btn) {
  if (favorites.has(id)) {
    favorites.delete(id);
    btn.textContent = '🤍';
    showToast('Removed from saved');
  } else {
    favorites.add(id);
    btn.textContent = '❤️';
    showToast('❤️ Saved!');
  }
  document.getElementById('favBadge').textContent = favorites.size;
  renderListings(getFiltered());
}

function showFavorites() {
  if (favorites.size === 0) {
    showToast('No favourites yet — tap 🤍 to save');
    return;
  }
  renderListings(LISTINGS.filter(i => favorites.has(i.id)));
  document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });
  showToast(`❤️ Showing ${favorites.size} saved item${favorites.size > 1 ? 's' : ''}`);
}

/* ══════════════════════════════════════
   PRODUCT DETAIL MODAL
══════════════════════════════════════ */
function openProduct(id) {
  const item = LISTINGS.find(l => l.id === id);
  if (!item) return;

  document.getElementById('productModalTitle').textContent = item.title;

  const stars =
    '★'.repeat(Math.round(item.rating)) +
    '☆'.repeat(5 - Math.round(item.rating));

  document.getElementById('productModalGrid').innerHTML = `
    <div>
      <img class="product-img-main" src="${item.img}" alt="${item.title}">
    </div>
    <div>
      <div class="product-detail-title">${item.title}</div>
      <div class="product-detail-price">
        $${item.price}
        ${item.oldPrice
          ? `<span style="font-size:16px;color:var(--muted);text-decoration:line-through;
                          font-family:'Outfit',sans-serif;font-weight:300">$${item.oldPrice}</span>`
          : ''}
      </div>
      <div class="product-detail-meta">
        <span>📍 ${item.location}</span>
        <span>🏷 ${item.condition}</span>
        <span style="color:var(--gold)">${stars}</span>
        <span>(${item.reviews} reviews)</span>
      </div>
      <div class="product-detail-desc">${item.desc}</div>
      <div class="seller-card">
        <div class="seller-avatar">👤</div>
        <div>
          <div class="seller-name">
            ${item.seller}
            <span class="verified-badge">✓ Verified</span>
          </div>
          <div class="seller-rating">⭐ ${item.rating} · ${item.reviews} reviews</div>
        </div>
      </div>
      <div class="product-actions">
        <button class="btn-contact"
          onclick="closeModal('productModal'); toggleChat(); showToast('💬 Chat started with ${item.seller}')">
          💬 Message Seller
        </button>
        <button class="btn-save-item"
          onclick="toggleFavFromModal(${item.id}, this)">🤍</button>
      </div>
    </div>
  `;
  document.getElementById('productModal').classList.add('open');
}

/* ══════════════════════════════════════
   CHAT
══════════════════════════════════════ */
function toggleChat() {
  document.getElementById('chatPanel').classList.toggle('open');
}

function sendMsg() {
  const input = document.getElementById('chatMsgInput');
  const txt   = input.value.trim();
  if (!txt) return;

  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'chat-msg chat-msg-out';
  div.innerHTML = `${txt}<div class="chat-msg-time">Just now</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  input.value = '';

  // Simulate reply
  setTimeout(() => {
    const replies = [
      "That sounds great! 😊",
      "Can we meet Saturday?",
      "Is local pickup available?",
      "Deal! 🙌",
      "Could you go a little lower?"
    ];
    const rep = document.createElement('div');
    rep.className = 'chat-msg chat-msg-in';
    rep.innerHTML = `${replies[Math.floor(Math.random() * replies.length)]}<div class="chat-msg-time">Just now</div>`;
    msgs.appendChild(rep);
    msgs.scrollTop = msgs.scrollHeight;
  }, 1200);
}

/* ══════════════════════════════════════
   MODALS
══════════════════════════════════════ */
function openListModal()   { document.getElementById('listModal').classList.add('open'); }
function closeModal(id)    { document.getElementById(id).classList.remove('open'); }
function submitListing()   { closeModal('listModal'); showToast('🎉 Your listing is now live!'); }
function showProfile()     { showToast('👤 Profile page coming soon!'); }

/* Close modals on overlay click */
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('open');
  });
});

/* ══════════════════════════════════════
   TOAST NOTIFICATIONS
══════════════════════════════════════ */
function showToast(msg) {
  const wrap = document.getElementById('toastWrap');
  const t    = document.createElement('div');
  t.className   = 'toast';
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
renderListings(LISTINGS);

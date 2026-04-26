// Data Produk Lengkap dengan Kategori
const productsData = [
  { id: 1, name: "Premium Backpack", category: "Bags", price: 89, original: 129, img: "assets/tas.jpg" },
  { id: 2, name: "T-Shirt", category: "Clothing", price: 29, original: 49, img: "assets/kaos.jpg" },
  { id: 3, name: "Leather Wallet", category: "Accessories", price: 35, original: 55, img: "assets/dompet.jpg" },
  { id: 4, name: "Shoe", category: "Electronics", price: 79, original: 129, img: "assets/air jordan.jpg" },
  { id: 5, name: "Jacket", category: "Clothing", price: 99, original: 149, img: "assets/jaket.jpg" },
  { id: 6, name: "O'clock", category: "Electronics", price: 149, original: 249, img: "assets/nct blue asean.jpg" },
  // Tambah produk baru di sini kalau mau
];

let cart = [];
let currentFilter = "all";

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartIcon = document.getElementById('cartIcon');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalSpan = document.getElementById('cartTotal');
const cartCountSpan = document.getElementById('cartCount');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

// Format Price
const formatPrice = (price) => `$${price}`;

// Show Toast
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// Render Products berdasarkan filter kategori
function renderProducts() {
  let filteredProducts = productsData;
  
  if (currentFilter !== "all") {
    filteredProducts = productsData.filter(p => p.category === currentFilter);
  }
  
  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `<div style="text-align:center; padding:50px; grid-column:1/-1;">No products in this category</div>`;
    return;
  }
  
  productsGrid.innerHTML = filteredProducts.map(product => `
    <div class="product-card">
      <div class="product-img">
        <img src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x260?text=No+Image'">
        <span class="badge">HOT</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="category">${product.category}</p>
        <div class="price">
          ${formatPrice(product.price)}
          <span class="old-price">${formatPrice(product.original)}</span>
        </div>
        <button class="add-btn" data-id="${product.id}">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
      </div>
    </div>
  `).join('');
  
  // Add event listeners to all add to cart buttons
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
  });
}

// Add to Cart
function addToCart(id) {
  const product = productsData.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  
  if(existing) {
    existing.quantity++;
    showToast(`Added another ${product.name}`);
  } else {
    cart.push({ ...product, quantity: 1 });
    showToast(`${product.name} added to cart!`);
  }
  
  updateCart();
  animateCart();
}

// Update Cart UI
function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  cartCountSpan.textContent = totalItems;
  cartTotalSpan.textContent = formatPrice(totalPrice);
  
  if(cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    return;
  }
  
  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/70x70?text=No+Image'">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-id="${item.id}" data-change="-1">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" data-id="${item.id}" data-change="1">+</button>
        </div>
      </div>
      <button class="remove-item" data-id="${item.id}">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join('');
  
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), parseInt(btn.dataset.change)));
  });
  
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
  });
}

// Update Quantity
function updateQuantity(id, change) {
  const item = cart.find(i => i.id === id);
  if(item) {
    item.quantity += change;
    if(item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
      showToast('Item removed from cart');
    }
    updateCart();
  }
}

// Remove from Cart
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  showToast('Item removed from cart');
  updateCart();
}

// Animate Cart Icon
function animateCart() {
  const icon = document.querySelector('.cart-icon');
  icon.style.transform = 'scale(1.1)';
  setTimeout(() => icon.style.transform = '', 200);
}

// Setup Filter Kategori - INI YANG PENTING!
function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Hapus class active dari semua button
      filterBtns.forEach(b => b.classList.remove('active'));
      // Tambah class active ke button yang diklik
      btn.classList.add('active');
      // Ambil nilai filter dari data-filter
      currentFilter = btn.getAttribute('data-filter');
      // Render ulang products berdasarkan filter
      renderProducts();
    });
  });
}

// Mobile Menu
function setupMobileMenu() {
  if(menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
}

// Cart Events
function setupCartEvents() {
  cartIcon.addEventListener('click', () => {
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  closeCartBtn.addEventListener('click', () => {
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  cartOverlay.addEventListener('click', (e) => {
    if(e.target === cartOverlay) {
      cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Checkout
function setupCheckout() {
  const checkoutBtn = document.querySelector('.checkout-btn');
  if(checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if(cart.length === 0) {
        showToast('Your cart is empty!');
        return;
      }
      alert(`Thank you for your order!\nTotal: ${cartTotalSpan.textContent}`);
      cart = [];
      updateCart();
      cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
}

// Contact Form
function setupContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Message sent successfully!');
      contactForm.reset();
    });
  }
}

// Initialize
function init() {
  renderProducts();
  setupFilters();
  setupMobileMenu();
  setupCartEvents();
  setupCheckout();
  setupContactForm();
}

// Start when page loads
document.addEventListener('DOMContentLoaded', init);

// Product data - initial seed data with peso prices
const initialProducts = [
  {
    id: 1,
    name: "Rhode Island Red Pullet",
    age: "4 months",
    category: "4-month",
    price: 150,
    image: "images/chicken-1.png",
    description: "Healthy 4-month-old Rhode Island Red pullet, ready to start laying soon. Great for backyard flocks.",
    breed: "Rhode Island Red",
    characteristics: ["Brown egg layer", "Hardy and cold-tolerant", "Docile temperament", "Starts laying at 5-6 months"],
    availability: "available"
  },
  {
    id: 2,
    name: "Leghorn Pullet",
    age: "4 months",
    category: "4-month",
    price: 180,
    image: "images/chicken-2.png",
    description: "Active 4-month-old White Leghorn pullet, excellent white egg producer.",
    breed: "Leghorn",
    characteristics: ["White egg layer", "High production (280+ eggs/year)", "Active and alert", "Lightweight feed converter"],
    availability: "available"
  },
  {
    id: 3,
    name: "Plymouth Rock Pullet",
    age: "5 months",
    category: "5-month",
    price: 280,
    image: "images/chicken-3.png",
    description: "5-month-old Barred Plymouth Rock pullet, dual-purpose breed, friendly and reliable.",
    breed: "Plymouth Rock",
    characteristics: ["Brown egg layer", "Dual-purpose (eggs and meat)", "Cold hardy", "Good for families"],
    availability: "available"
  },
  {
    id: 4,
    name: "Orpington Pullet",
    age: "5 months",
    category: "5-month",
    price: 320,
    image: "images/chicken-4.jpg",
    description: "Beautiful 5-month-old Buff Orpington pullet, fluffy and calm temperament.",
    breed: "Orpington",
    characteristics: ["Brown egg layer", "Very docile and friendly", "Cold tolerant", "Excellent broody hen"],
    availability: "available"
  },
  {
    id: 5,
    name: "Australorp Hen",
    age: "6 months",
    category: "6-month-plus",
    price: 450,
    image: "images/chicken-5.png",
    description: "Mature 6-month-old Australorp hen, already laying, world-record egg producer.",
    breed: "Australorp",
    characteristics: ["Brown egg layer", "Record egg production", "Heat tolerant", "Already laying eggs"],
    availability: "available"
  },
  {
    id: 6,
    name: "Sussex Hen",
    age: "8 months",
    category: "6-month-plus",
    price: 480,
    image: "images/chicken-6.png",
    description: "Mature 8-month-old Sussex hen, dual-purpose, reliable brown egg layer.",
    breed: "Sussex",
    characteristics: ["Brown egg layer", "Dual-purpose breed", "Good forager", "Already laying eggs"],
    availability: "unavailable"
  }
];

// State management
let products = JSON.parse(localStorage.getItem("poultry_products")) || [...initialProducts];
let cart = JSON.parse(localStorage.getItem("poultry_cart")) || [];

function saveProducts() {
  localStorage.setItem("poultry_products", JSON.stringify(products));
}

function saveCart() {
  localStorage.setItem("poultry_cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const countEl = document.querySelector(".cart-count");
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (countEl) {
    countEl.textContent = total;
    countEl.style.display = total > 0 ? "inline-block" : "none";
  }
}

// Image fallback - use colored placeholder if image fails
function handleImageError(img) {
  const colors = ["#2d6a4f", "#52b788", "#d4a373", "#1d3557", "#f1faee", "#8ab17d"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  img.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='${color}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='sans-serif' font-size='24'>Chicken Image</text></svg>`;
  img.onerror = null;
}

// Format price in pesos
function formatPrice(price) {
  return "₱" + price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// Render product cards
function renderProducts(containerSelector, filterCategory = null) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  let filtered = products;
  if (filterCategory) {
    filtered = products.filter(p => p.category === filterCategory);
  }

  if (filtered.length === 0) {
    container.innerHTML = '<div class="no-data">No chickens available in this category.</div>';
    return;
  }

  container.innerHTML = filtered.map(product => `
    <article class="card">
      <div class="card-image">
        <img src="${product.image}" alt="${product.name}" onerror="handleImageError(this)">
        <span class="badge">${product.age}</span>
      </div>
      <div class="card-content">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
      </div>
      <div class="card-footer">
        <span class="price">${formatPrice(product.price)}</span>
        <button class="btn btn-sm" onclick="addToCart(${product.id})" ${product.availability === 'unavailable' ? 'disabled' : ''}>
          ${product.availability === 'unavailable' ? 'Unavailable' : 'Add to Cart'}
        </button>
      </div>
    </article>
  `).join('');
}

// Render product detail page
function renderProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const product = products.find(p => p.id === id);

  if (!product) {
    document.querySelector(".product-detail-grid").innerHTML = '<div class="no-data">Product not found.</div>';
    return;
  }

  document.title = product.name + " - Gladys Poultry Farm";

  document.querySelector(".product-main-image").innerHTML = `
    <img src="${product.image}" alt="${product.name}" onerror="handleImageError(this)">
  `;

  document.querySelector(".product-info h1").textContent = product.name;

  const metaEl = document.querySelector(".product-meta");
  metaEl.innerHTML = `
    <span>${product.breed}</span>
    <span>${product.age}</span>
    <span>${product.category.replace('-', ' ')}</span>
  `;

  document.querySelector(".product-description").textContent = product.description;

  const charsEl = document.querySelector(".product-characteristics ul");
  charsEl.innerHTML = product.characteristics.map(c => `<li>${c}</li>`).join('');

  document.querySelector(".product-price").textContent = formatPrice(product.price);

  const availEl = document.querySelector(".product-availability");
  availEl.textContent = product.availability === 'available' ? 'In Stock' : 'Out of Stock';
  availEl.className = 'product-availability ' + product.availability;

  const addBtn = document.querySelector(".add-to-cart");
  addBtn.disabled = product.availability === 'unavailable';
  addBtn.textContent = product.availability === 'unavailable' ? 'Out of Stock' : 'Add to Cart';
  addBtn.onclick = () => addToCart(product.id);
}

// Add to cart
window.addToCart = function (id) {
  const product = products.find(p => p.id === id);
  if (!product || product.availability === 'unavailable') return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  showNotification(product.name + " added to cart!");
};

// Show notification
function showNotification(message) {
  const notif = document.querySelector(".cart-notification");
  if (!notif) return;
  notif.textContent = message;
  notif.style.display = "block";
  setTimeout(() => { notif.style.display = "none"; }, 3000);
}

// Cart modal functions
function openCartModal() {
  const overlay = document.querySelector(".cart-modal-overlay");
  const itemsContainer = document.querySelector(".cart-items");
  const totalEl = document.querySelector(".cart-total");

  if (!overlay) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<div class="no-data" style="padding:2rem">Your cart is empty.</div>';
    totalEl.textContent = formatPrice(0);
  } else {
    itemsContainer.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" onerror="handleImageError(this)">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${item.age} &#8226; ${formatPrice(item.price)} each</p>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalEl.textContent = formatPrice(total);
  }

  overlay.style.display = "flex";
}

function closeCartModal() {
  const overlay = document.querySelector(".cart-modal-overlay");
  if (overlay) overlay.style.display = "none";
}

window.removeFromCart = function (index) {
  cart.splice(index, 1);
  saveCart();
  openCartModal();
};

// Admin dashboard rendering
function renderAdmin() {
  const tbody = document.querySelector("#products-table tbody");
  if (!tbody) return;

  tbody.innerHTML = products.map((product, index) => `
    <tr>
      <td><img src="${product.image}" alt="${product.name}" style="width:50px;height:50px;object-fit:cover;border-radius:4px;" onerror="handleImageError(this)"></td>
      <td>${product.name}</td>
      <td>${product.breed}</td>
      <td>${product.age}</td>
      <td class="price-cell">${formatPrice(product.price)}</td>
      <td><span class="status-badge status-${product.availability}">${product.availability === 'available' ? 'Available' : 'Unavailable'}</span></td>
      <td>
        <div class="action-btns">
          <button class="edit-btn" onclick="openEditModal(${index})">Edit</button>
          <button class="delete-btn" onclick="deleteProduct(${index})">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Add/edit product form
const productForm = document.getElementById("product-form");
if (productForm) {
  productForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("prod-name").value.trim();
    const breed = document.getElementById("prod-breed").value.trim();
    const age = document.getElementById("prod-age").value;
    const category = document.getElementById("prod-category").value;
    const price = parseFloat(document.getElementById("prod-price").value);
    const description = document.getElementById("prod-description").value.trim();
    const characteristics = document.getElementById("prod-characteristics").value.split(",").map(c => c.trim()).filter(Boolean);
    const availability = document.getElementById("prod-availability").value;
    const image = document.getElementById("prod-image").value.trim() || "images/chicken-default.png";

    const editingIndex = parseInt(document.getElementById("editing-index").value);

    const productData = {
      id: editingIndex >= 0 ? products[editingIndex].id : Date.now(),
      name, breed, age, category, price, description, characteristics, availability, image
    };

    if (editingIndex >= 0) {
      products[editingIndex] = productData;
    } else {
      products.push(productData);
    }

    saveProducts();
    renderAdmin();
    renderProducts(".products-grid");
    renderProducts(".featured-grid");

    // Close modal / reset
    document.getElementById("admin-add-modal").style.display = "none";
    productForm.reset();
    document.getElementById("editing-index").value = -1;
    document.querySelector("#admin-add-modal .modal-header h3").textContent = "Add Chicken";
  });
}

function openAddModal() {
  document.getElementById("editing-index").value = -1;
  document.querySelector("#admin-add-modal .modal-header h3").textContent = "Add Chicken";
  productForm.reset();
  document.getElementById("admin-add-modal").style.display = "flex";
}

window.openEditModal = function (index) {
  const product = products[index];
  document.getElementById("editing-index").value = index;
  document.querySelector("#admin-add-modal .modal-header h3").textContent = "Edit Chicken";
  document.getElementById("prod-name").value = product.name;
  document.getElementById("prod-breed").value = product.breed;
  document.getElementById("prod-age").value = product.age;
  document.getElementById("prod-category").value = product.category;
  document.getElementById("prod-price").value = product.price;
  document.getElementById("prod-description").value = product.description;
  document.getElementById("prod-characteristics").value = product.characteristics.join(", ");
  document.getElementById("prod-availability").value = product.availability;
  document.getElementById("prod-image").value = product.image;
  document.getElementById("admin-add-modal").style.display = "flex";
};

window.deleteProduct = function (index) {
  if (!confirm("Delete this chicken listing?")) return;
  products.splice(index, 1);
  saveProducts();
  renderAdmin();
  renderProducts(".products-grid");
  renderProducts(".featured-grid");
};

// Close modal when clicking outside
window.addEventListener("click", function (e) {
  const addModal = document.getElementById("admin-add-modal");
  const cartOverlay = document.querySelector(".cart-modal-overlay");
  if (addModal && e.target === addModal) addModal.style.display = "none";
  if (cartOverlay && e.target === cartOverlay) closeCartModal();
});

// Initialize on load
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();

  // Cart button
  const cartBtn = document.getElementById("cart-btn");
  const closeCartBtn = document.getElementById("close-cart-modal");
  if (cartBtn) cartBtn.addEventListener("click", openCartModal);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartModal);

  // Admin tab switching
  document.querySelectorAll(".admin-tab-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".admin-tab-content").forEach(c => c.classList.remove("active"));
      this.classList.add("active");
      document.getElementById(this.dataset.tab).classList.add("active");
      if (this.dataset.tab === "manage-products") renderAdmin();
    });
  });

  // Mobile menu toggle
  const mobileBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", () => navLinks.classList.toggle("active"));
  }

  // Category filter buttons on products page
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      renderProducts(".products-grid", this.dataset.category);
    });
  });

  // Page-specific rendering
  if (document.querySelector(".featured-grid")) renderProducts(".featured-grid");
  if (document.querySelector(".products-grid")) renderProducts(".products-grid");
  if (document.querySelector(".product-detail-grid")) renderProductDetail();
  if (document.querySelector("#products-table")) renderAdmin();
});

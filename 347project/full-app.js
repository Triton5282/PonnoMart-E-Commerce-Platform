// full-app.js
document.addEventListener("DOMContentLoaded", () => {
  // ====== Elements ======
  const authSidebar     = document.getElementById("authSidebar");
  const cartSidebar     = document.getElementById("cartSidebar");
  const compareSidebar  = document.getElementById("compareSidebar");
  const accountSidebar  = document.getElementById("accountSidebar");

  const accountIcon     = document.querySelector(".Accounts");

  const loginForm       = document.getElementById("loginForm");
  const signupForm      = document.getElementById("signupForm");

  const cartContent     = document.querySelector(".cart-content");
  const compareContent  = document.querySelector(".compare-content");

  // ====== Login state (persisted) ======
  let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // ====== Account icon opens Login (if not logged in) or Account menu ======
  if (accountIcon) {
    accountIcon.addEventListener("click", () => {
      if (!isLoggedIn) {
        authSidebar.classList.add("open");
      } else {
        accountSidebar.classList.add("open");
      }
    });
  }

  // ====== Expose functions used by inline onclick in your HTML ======
  window.closeSidebar = function () {
    authSidebar.classList.remove("open");
  };

  window.toggleCart = function () {
    if (!isLoggedIn) {
      authSidebar.classList.add("open");
      return;
    }
    cartSidebar.classList.toggle("open");
  };

  window.toggleCompare = function () {
    if (!isLoggedIn) {
      authSidebar.classList.add("open");
      return;
    }
    compareSidebar.classList.toggle("open");
  };

  window.toggleAccount = function () {
    accountSidebar.classList.toggle("open");
  };

  window.logout = function () {
    isLoggedIn = false;
    localStorage.setItem("isLoggedIn", "false");
    accountSidebar.classList.remove("open");
    alert("You have logged out.");
  };

  // ====== Switch Login/Signup forms ======
  window.switchForm = function (type) {
    if (type === "signup") {
      loginForm.classList.add("hidden");
      signupForm.classList.remove("hidden");
    } else {
      signupForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
    }
  };

  // ====== Auth submit (fake success) ======
  function handleLoginSuccess() {
    isLoggedIn = true;
    localStorage.setItem("isLoggedIn", "true");
    authSidebar.classList.remove("open");
    alert("✅ Login successful! Now you can use Cart and Compare.");
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleLoginSuccess();
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleLoginSuccess();
    });
  }

  // ====== Carousel scroll (matches your HTML's onclick) ======
  window.scrollCarousel = function (direction) {
    const carousel = document.getElementById("carousel");
    const scrollAmount = 300;
    if (carousel) {
      carousel.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
    }
  };

  // ====== Cart & Compare data ======
  let cartItems = [];       // [{id,name,price}]
  let compareItems = [];    // [{id,name,price}]

  // Helpers
  const uid = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  function renderCartUI() {
    if (!cartContent) return;
    if (cartItems.length === 0) {
      cartContent.innerHTML = "<p>Your cart is empty</p>";
      return;
    }
    cartContent.innerHTML = cartItems
      .map(
        (item) => `
      <div class="cart-item">
        <img src="${item.img || "product-placeholder.jpg"}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <p>$${item.price}</p>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${item.id}')">❌</button>
      </div>
    `
      )
      .join("") + `
      <div class="cart-footer">
        <button class="checkout-btn">Checkout</button>
      </div>`;
  }

  function renderCompareUI() {
    if (!compareContent) return;
    if (compareItems.length === 0) {
      compareContent.innerHTML = "<p>No products selected for comparison</p>";
      return;
    }
    compareContent.innerHTML = compareItems
      .map(
        (item) => `
      <div class="cart-item">
        <img src="${item.img || "product-placeholder.jpg"}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <p>$${item.price ?? "-"}</p>
        </div>
        <button class="remove-btn" onclick="removeFromCompare('${item.id}')">❌</button>
      </div>
    `
      )
      .join("");
  }

  // Expose remove functions for inline onclick
  window.removeFromCart = function (id) {
    cartItems = cartItems.filter((x) => x.id !== id);
    renderCartUI();
  };

  window.removeFromCompare = function (id) {
    compareItems = compareItems.filter((x) => x.id !== id);
    renderCompareUI();
  };

  // ====== Wire orange buttons (Add to Cart / Compare) ======
  // Expecting buttons like:
  // <button class="btn-orange add-cart" data-product="Product 1" data-price="25" data-img="product1.jpg">...</button>
  // <button class="btn-orange add-compare" data-product="Product 1" data-price="25" data-img="product1.jpg">...</button>
  document.querySelectorAll(".add-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!isLoggedIn) {
        authSidebar.classList.add("open");
        return;
      }
      const name  = btn.dataset.product || "Product";
      const price = parseFloat(btn.dataset.price || "0");
      const img   = btn.dataset.img || "";
      cartItems.push({ id: uid(), name, price, img });
      renderCartUI();
      alert(`${name} added to cart 🛒`);
      cartSidebar.classList.add("open");
    });
  });

  document.querySelectorAll(".add-compare").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!isLoggedIn) {
        authSidebar.classList.add("open");
        return;
      }
      const name  = btn.dataset.product || "Product";
      const price = btn.dataset.price ? parseFloat(btn.dataset.price) : undefined;
      const img   = btn.dataset.img || "";

      // prevent duplicates by name
      if (compareItems.some((i) => i.name === name)) {
        alert("This product is already in the compare list.");
        compareSidebar.classList.add("open");
        return;
      }
      // limit 3
      if (compareItems.length >= 3) {
        alert("You can only compare up to 3 products.");
        compareSidebar.classList.add("open");
        return;
      }

      compareItems.push({ id: uid(), name, price, img });
      renderCompareUI();
      alert(`${name} added to compare ⚖️`);
      compareSidebar.classList.add("open");
    });
  });

  // Initial render (in case something persisted later)
  renderCartUI();
  renderCompareUI();
});

// ===== CART FUNCTIONALITY =====
let cart = [];
document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
        let product = btn.dataset.product;
        let price = btn.dataset.price;
        cart.push({ product, price });
        updateCartSidebar();
    });
});

function updateCartSidebar() {
    let cartSidebar = document.getElementById("cartSidebar");
    cartSidebar.innerHTML = "<h3>Cart</h3>";
    cart.forEach(item => {
        cartSidebar.innerHTML += `<p>${item.product} - $${item.price}</p>`;
    });
}

// ===== COMPARE FUNCTIONALITY =====
let compare = [];
document.querySelectorAll(".add-compare").forEach(btn => {
    btn.addEventListener("click", () => {
        let product = btn.dataset.product;
        if (!compare.includes(product)) {
            compare.push(product);
        }
        updateCompareSidebar();
    });
});

function updateCompareSidebar() {
    let compareSidebar = document.getElementById("compareSidebar");
    compareSidebar.innerHTML = "<h3>Compare</h3>";
    compare.forEach(item => {
        compareSidebar.innerHTML += `<p>${item}</p>`;
    });
}

// ===== FILTER FUNCTIONALITY (basic demo) =====
const checkboxes = document.querySelectorAll(".filter-sidebar input[type='checkbox']");
checkboxes.forEach(box => {
    box.addEventListener("change", () => {
        let activeFilters = [];
        checkboxes.forEach(c => {
            if (c.checked) activeFilters.push(c.id);
        });

        document.querySelectorAll(".ProductCard").forEach(card => {
            let productName = card.querySelector("h4").textContent.toLowerCase();
            if (activeFilters.length === 0 || activeFilters.some(f => productName.includes(f))) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
});

// ===== PRICE FILTER (range slider) =====
const priceRange = document.querySelector(".filter-section input[type='range']");
if (priceRange) {
    priceRange.addEventListener("input", () => {
        let maxPrice = parseInt(priceRange.value);
        document.querySelectorAll(".ProductCard").forEach(card => {
            let price = parseInt(card.querySelector("p").textContent.replace("$",""));
            card.style.display = (price <= maxPrice) ? "block" : "none";
        });
    });
}

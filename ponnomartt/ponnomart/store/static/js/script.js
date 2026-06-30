document.addEventListener("DOMContentLoaded", () => {
  // ====== Elements ======
  const authSidebar    = document.getElementById("authSidebar");
  const accountSidebar = document.getElementById("accountSidebar");
  const cartSidebar    = document.getElementById("cartSidebar");
  const compareSidebar = document.getElementById("compareSidebar");
  const accountIcon    = document.querySelector(".Accounts");

  const loginForm      = document.getElementById("loginForm");
  const signupForm     = document.getElementById("signupForm");

  const cartContent    = cartSidebar?.querySelector(".cart-content");
  const compareContent = compareSidebar?.querySelector(".compare-content");

  // ====== State ======
  let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  let compareItems = JSON.parse(localStorage.getItem("compareItems") || "[]");

  // ====== Helper UID ======
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  // ====== Sidebar visibility ======
 const updateSidebarVisibility = () => {
  if (isLoggedIn) {
    authSidebar?.classList.remove("open");
    accountSidebar?.classList.remove("open"); // ❌ always closing
  } else {
    authSidebar?.classList.remove("open");
    accountSidebar?.classList.remove("open"); // ❌ always closing
  }
};
  updateSidebarVisibility();

  // ====== Account icon click ======
accountIcon?.addEventListener("click", () => {
  if (isLoggedIn) {
    accountSidebar?.classList.toggle("open");
    authSidebar?.classList.remove("open");
  } else {
    authSidebar?.classList.toggle("open");
    accountSidebar?.classList.remove("open");
  }
});


  // ====== Logout ======
  window.logout = () => {
    isLoggedIn = false;
    localStorage.setItem("isLoggedIn", "false");
    updateSidebarVisibility();
    alert("Logged out successfully");
  };

  // ====== Login/Signup ======
  function handleLoginSuccess() {
    isLoggedIn = true;
    localStorage.setItem("isLoggedIn", "true");
    authSidebar?.classList.remove("open");
    alert("✅ Login successful! Cart and Compare are now available.");
  }

  loginForm?.addEventListener("submit", e => { e.preventDefault(); handleLoginSuccess(); });
  signupForm?.addEventListener("submit", e => { e.preventDefault(); handleLoginSuccess(); });

  window.switchForm = (type) => {
    if (type === "signup") {
      loginForm?.classList.add("hidden");
      signupForm?.classList.remove("hidden");
    } else {
      signupForm?.classList.add("hidden");
      loginForm?.classList.remove("hidden");
    }
  };

  // ====== Render functions ======
  const renderCartUI = () => {
    if (!cartContent) return;
    if (cartItems.length === 0) cartContent.innerHTML = "<p>Your cart is empty</p>";
    else cartContent.innerHTML = cartItems.map(item => `
      <div class="cart-item">
        <img src="${item.img || 'product-placeholder.jpg'}" alt="${item.name}">
        <div><h4>${item.name}</h4><p>$${item.price}</p></div>
        <button class="remove-btn" onclick="removeFromCart('${item.id}')">❌</button>
      </div>
    `).join("");
  };

  const renderCompareUI = () => {
    if (!compareContent) return;
    if (compareItems.length === 0) compareContent.innerHTML = "<p>No products selected for comparison</p>";
    else compareContent.innerHTML = compareItems.map(item => `
      <div class="cart-item">
        <img src="${item.img || 'product-placeholder.jpg'}" alt="${item.name}">
        <div><h4>${item.name}</h4><p>$${item.price ?? '-'}</p></div>
        <button class="remove-btn" onclick="removeFromCompare('${item.id}')">❌</button>
      </div>
    `).join("");
  };

  window.removeFromCart = (id) => {
    cartItems = cartItems.filter(x => x.id !== id);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    renderCartUI();
    updateCartCount();
  };

  window.removeFromCompare = (id) => {
    compareItems = compareItems.filter(x => x.id !== id);
    localStorage.setItem("compareItems", JSON.stringify(compareItems));
    renderCompareUI();
  };

  // ====== Cart/Compare toggles ======
  window.toggleCart = () => {
    if (!isLoggedIn) authSidebar?.classList.add("open");
    else cartSidebar?.classList.toggle("open");
  };
  window.toggleCompare = () => {
    if (!isLoggedIn) authSidebar?.classList.add("open");
    else compareSidebar?.classList.toggle("open");
  };
  window.toggleAccount = () => accountSidebar?.classList.toggle("open");
  window.closeSidebar = () => authSidebar?.classList.remove("open");

  // ====== Add to Cart ======
  document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!isLoggedIn) { authSidebar?.classList.add("open"); return; }
      const name  = btn.dataset.product;
      const price = parseFloat(btn.dataset.price || 0);
      const img   = btn.dataset.img || "";
      cartItems.push({ id: uid(), name, price, img });
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      renderCartUI();
      updateCartCount();
      cartSidebar?.classList.add("open");
    });
  });

  // ====== Add to Compare ======
  document.querySelectorAll(".add-compare").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!isLoggedIn) { authSidebar?.classList.add("open"); return; }
      const name  = btn.dataset.product;
      const price = parseFloat(btn.dataset.price || 0);
      const img   = btn.dataset.img || "";
      if (compareItems.some(i => i.name === name) || compareItems.length >= 3) {
        compareSidebar?.classList.add("open");
        return;
      }
      compareItems.push({ id: uid(), name, price, img });
      localStorage.setItem("compareItems", JSON.stringify(compareItems));
      renderCompareUI();
      compareSidebar?.classList.add("open");
    });
  });

  // ====== Cart count ======
  const cartCount = document.getElementById("cartCount");
  const updateCartCount = () => { if (cartCount) cartCount.textContent = cartItems.length; };
  updateCartCount();

  // ====== Initial render ======
  renderCartUI();
  renderCompareUI();
});

document.addEventListener("DOMContentLoaded", () => {
  const authSidebar     = document.getElementById("authSidebar");
  const cartSidebar     = document.getElementById("cartSidebar");
  const compareSidebar  = document.getElementById("compareSidebar");
  const accountSidebar  = document.getElementById("accountSidebar");

  const loginForm       = document.getElementById("loginForm");
  const signupForm      = document.getElementById("signupForm");

  const cartContent     = document.querySelector(".cart-content");
  const compareContent  = document.querySelector(".compare-content");

  let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  window.closeSidebar = function(id) {
    document.getElementById(id).classList.remove("open");
  }

  window.toggleCart = function() {
    if (!isLoggedIn) { authSidebar.classList.add("open"); return; }
    cartSidebar.classList.toggle("open");
  }

  window.toggleCompare = function() {
    if (!isLoggedIn) { authSidebar.classList.add("open"); return; }
    compareSidebar.classList.toggle("open");
  }

  window.logout = function() {
    isLoggedIn = false;
    localStorage.setItem("isLoggedIn", "false");
    accountSidebar.classList.remove("open");
  }

  function handleLoginSuccess() {
    isLoggedIn = true;
    localStorage.setItem("isLoggedIn", "true");
    authSidebar.classList.remove("open");
  }

  loginForm?.addEventListener("submit", e => { e.preventDefault(); handleLoginSuccess(); });
  signupForm?.addEventListener("submit", e => { e.preventDefault(); handleLoginSuccess(); });

  let cartItems = [];
  let compareItems = [];
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8);

  function renderCart() {
    if(!cartContent) return;
    if(cartItems.length===0) { cartContent.innerHTML="<p>Your cart is empty</p>"; return; }
    cartContent.innerHTML = cartItems.map(i=>`
      <div class="cart-item">
        <img src="${i.img||'product-placeholder.jpg'}" alt="${i.name}">
        <div><h4>${i.name}</h4><p>$${i.price}</p></div>
        <button class="remove-btn" onclick="removeFromCart('${i.id}')">❌</button>
      </div>`).join('') + `<div class="cart-footer"><button class="checkout-btn">Checkout</button></div>`;
  }

  function renderCompare() {
    if(!compareContent) return;
    if(compareItems.length===0) { compareContent.innerHTML="<p>No products selected for comparison</p>"; return; }
    compareContent.innerHTML = compareItems.map(i=>`
      <div class="cart-item">
        <img src="${i.img||'product-placeholder.jpg'}" alt="${i.name}">
        <div><h4>${i.name}</h4><p>$${i.price||'-'}</p></div>
        <button class="remove-btn" onclick="removeFromCompare('${i.id}')">❌</button>
      </div>`).join('');
  }

  window.removeFromCart = id => { cartItems = cartItems.filter(i=>i.id!==id); renderCart(); }
  window.removeFromCompare = id => { compareItems = compareItems.filter(i=>i.id!==id); renderCompare(); }

  document.querySelectorAll(".add-cart").forEach(btn=>{
    btn.addEventListener("click",()=>{
      if(!isLoggedIn){ authSidebar.classList.add("open"); return; }
      cartItems.push({ id: uid(), name: btn.dataset.product, price: parseFloat(btn.dataset.price), img: btn.dataset.img });
      renderCart(); cartSidebar.classList.add("open");
    });
  });

  document.querySelectorAll(".add-compare").forEach(btn=>{
    btn.addEventListener("click",()=>{
      if(!isLoggedIn){ authSidebar.classList.add("open"); return; }
      if(compareItems.length>=3){ alert("Compare limit 3"); return; }
      if(compareItems.some(i=>i.name===btn.dataset.product)) return;
      compareItems.push({ id: uid(), name: btn.dataset.product, price: parseFloat(btn.dataset.price), img: btn.dataset.img });
      renderCompare(); compareSidebar.classList.add("open");
    });
  });

  // ===== FILTERS =====
  const checkboxes = document.querySelectorAll(".filter-sidebar input[type='checkbox']");
  checkboxes.forEach(box=>box.addEventListener("change",()=>{
    const active = Array.from(checkboxes).filter(c=>c.checked).map(c=>c.id);
    document.querySelectorAll(".ProductCard").forEach(card=>{
      const name = card.querySelector("h4").textContent.toLowerCase();
      card.style.display = (active.length===0||active.some(f=>name.includes(f))) ? "block":"none";
    });
  }));

  const priceRange = document.querySelector(".filter-section input[type='range']");
  if(priceRange){
    priceRange.addEventListener("input",()=>{
      const max = parseInt(priceRange.value);
      document.querySelectorAll(".ProductCard").forEach(card=>{
        const price = parseInt(card.querySelector("p").textContent.replace("$",""));
        card.style.display = (price<=max) ? "block":"none";
      });
    });
  }

  renderCart(); renderCompare();
});


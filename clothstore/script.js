const products = [
  {
    id: 1,
    name: "Classic T-Shirt",
    brand: "BestShirt",
    category: "men",
    price: 25.99,
    image: "https://qikink.com/wp-content/uploads/2023/06/Unisex-classic-t-Shirt-qikink-600x600.webp",
  },
  {
    id: 2,
    name: "Elegant Dress",
    brand: "Elegance",
    category: "women",
    price: 79.99,
    image: "https://www.ostty.com/cdn/shop/files/white-long-sleeves-v-neck-elegant-wedding-dress-os4074-hautenovias-dress-muslim-ostty-top-design-2022-bridal-party-dresses-ostty-ostty-151.jpg?v=1723066670",
  },
    {
    id: 3,
    name: "Sporty Hoodie",
    brand: "SportGear",
    category: "men",
    price: 49.99,
    image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQEx1ZymDjM4vFt5T2qHeFAdNjn4Xtyo-e43_P_uUcHAFO4LuKesLltPKg73u-QsJsJgz8Zrwnbc00genwJl_Ljyh_RAaJzB0omwR8D1hBns9cyT6l-auURqg",
    },
  {
    id: 4,
    name: "Cute Jumpsuit",
    brand: "Cutesie",
    category: "kids",
    price: 39.99,
    image: "https://jujujam.in/cdn/shop/files/Background.png?v=1726222677",
  },
  {
    id: 5,
    name: "Summer Shorts",
    brand: "SunnyDays",
    category: "women",
    price: 30.5,
    image: "https://www.beyours.in/cdn/shop/collections/air-shorts.webp?v=1703330003",
  },
  {
    id: 6,
    name: "Denim Jeans",
    brand: "JeansPlus",
    category: "men",
    price: 59.99,
    image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQu4FD2KiXJqZTZYWKwQuYdZ87clvF7n0YpHasbSOeF0IjixTrsIQAKABFN7xgJHrzyIP7xxLFQtjjxfeI5uxyMB8EzvkDd-i2yhDjIkSSLWZUXerOFnAyFeg",
  },
];

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const categoryFilter = document.getElementById("category-filter");
const cartCountElement = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalPrice = document.getElementById("cart-total-price");
const cartModal = document.querySelector(".cart-container");
const closeCartButton = document.querySelector(".close-cart");

let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function renderProducts(filteredProducts = products) {
  productList.innerHTML = "";
  filteredProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">$${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(productCard);
  });
}

function updateCartDisplay() {
  cartCountElement.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);

  cartItemsContainer.innerHTML = "";
  let totalPrice = 0;

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      totalPrice += product.price * item.quantity;
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="item-details">
          <h4>${product.name}</h4>
          <div class="quantity-control">
            <button onclick="changeQuantity(${product.id}, -1)">-</button>
            <input type="text" value="${item.quantity}" readonly>
            <button onclick="changeQuantity(${product.id}, 1)">+</button>
          </div>
        </div>
        <p class="price">$${(product.price * item.quantity).toFixed(2)}</p>
      `;
      cartItemsContainer.appendChild(cartItem);
    }
  });

  cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  updateCartDisplay();
}

function changeQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter((cartItem) => cartItem.id !== productId);
    }
    updateCartDisplay();
  }
}

function filterProducts() {
  const query = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) &&
      (category === "all" || product.category === category)
  );
  renderProducts(filteredProducts);
}

function toggleCart() {
  cartModal.classList.toggle("active");
}

searchButton.addEventListener("click", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
closeCartButton.addEventListener("click", toggleCart);

renderProducts();
updateCartDisplay();

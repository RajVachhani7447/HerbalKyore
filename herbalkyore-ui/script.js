function filterProducts(category) {
  const products = document.querySelectorAll('.product-card');
  products.forEach(product => {
    if (category === 'all') {
      product.style.display = 'block';
    } else if (product.classList.contains(category)) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}
// Called when clicking a product card
function openProductPage(productId) {
  window.location.href = `product.html?product=${encodeURIComponent(productId)}`;
}


// On product.html - load product data






function searchProducts() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const products = document.querySelectorAll('.product-card');
  products.forEach(product => {
    const name = product.querySelector('h4').textContent.toLowerCase();
    product.style.display = name.includes(input) ? 'block' : 'none';
  });
}



function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Check if item already exists in cart
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  // alert(`${name} added to cart!`);
}

// // On product page load
// document.addEventListener("DOMContentLoaded", () => {
//   const product = JSON.parse(localStorage.getItem("productData"));
//   if (!product) return;

//   // Set product details
//   document.getElementById("product-title").textContent = product.name;
//   document.getElementById("product-price").textContent = product.price;
//   document.getElementById("product-type").textContent = `Type: ${product.type}`;
//   document.getElementById("product-image").src = product.image;

//   // Attach Add to Cart functionality
//   document.getElementById("add-to-cart-btn").addEventListener("click", () => {
//     addToCart(product.name, parseInt(product.price.replace(/[^\d]/g, '')), product.image);
//   });
// });






function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countSpan = document.getElementById('cart-count');
  if (countSpan) countSpan.textContent = count;
}

document.addEventListener("DOMContentLoaded", updateCartCount);




document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartContainer.innerHTML = "";
    let total = 0;
    let itemCount = 0;

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      cartTotal.textContent = "0";
      cartCount.textContent = "0";
      return;
    }

    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      itemCount += item.quantity;
    
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");
      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="details">
          <h4>${item.name}</h4>
          <p>Price: ₹${item.price}</p>
          <div class="quantity-controls">
            <button onclick="changeQuantity(${index}, -1)">–</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity(${index}, 1)">+</button>
          </div>
          <button onclick="removeItem(${index})">Remove</button>
        </div>`;
      cartContainer.appendChild(itemDiv);
    });
    

    cartTotal.textContent = total;
    cartCount.textContent = itemCount;
  }

  window.removeItem = function(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  };

  window.changeQuantity = function(index, change) {
    if (cart[index].quantity + change <= 0) {
      if (confirm("Remove this item from cart?")) {
        cart.splice(index, 1);
      }
    } else {
      cart[index].quantity += change;
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  };
  

  renderCart();







  
  











  // Checkout button
//   document.getElementById("checkout-btn").addEventListener("click", () => 
//     {
//     alert("Thank you! Checkout functionality coming soon.");
//   }
// );
});





const scriptURL = 'https://script.google.com/macros/s/AKfycbwc49tIUb09yS1w33tI65uX903KO0hpKLnoINciW4nYoWvhTDIegLUJW9DlIyD5ZmHmxg/exec'

const form = document.forms['contact-form']

form.addEventListener('submit', e => {
  
  e.preventDefault()
  
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
  // .then(response => alert("Thank you! Form is submitted" ))
  .then(() => { window.location.reload(); })
  .catch(error => error('Error!', error.message))
})


let slider = document.querySelector('.slider .list');
let items = document.querySelectorAll('.slider .list .item');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let dots = document.querySelectorAll('.slider .dots li');

let lengthItems = items.length - 1;
let active = 0;
next.onclick = function(){
    active = active + 1 <= lengthItems ? active + 1 : 0;
    reloadSlider();
}
prev.onclick = function(){
    active = active - 1 >= 0 ? active - 1 : lengthItems;
    reloadSlider();
}
let refreshInterval = setInterval(()=> {next.click()}, 3000);
function reloadSlider(){
    slider.style.left = -items[active].offsetLeft + 'px';
    // 
    let last_active_dot = document.querySelector('.slider .dots li.active');
    last_active_dot.classList.remove('active');
    dots[active].classList.add('active');

    clearInterval(refreshInterval);
    refreshInterval = setInterval(()=> {next.click()}, 3000);

    
}

dots.forEach((li, key) => {
    li.addEventListener('click', ()=>{
         active = key;
         reloadSlider();
    })
})
window.onresize = function(event) {
    reloadSlider();
};













// Products data
const products = [
    { id: 1, name: 'Laptop', price: 999, emoji: '💻' },
    { id: 2, name: 'Headphones', price: 199, emoji: '🎧' },
    { id: 3, name: 'T-Shirt', price: 29, emoji: '👕' },
    { id: 4, name: 'Sneakers', price: 89, emoji: '👟' },
    { id: 5, name: 'Coffee Mug', price: 15, emoji: '☕' }
];

// Shopping cart
let cart = [];

// Display products on the page
function displayProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.error('productsGrid element not found!');
        return;
    }
    
    // Clear the grid first
    grid.innerHTML = '';
    
    // Add each product
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${p.emoji}</div>
            <div class="product-title">${p.name}</div>
            <div class="product-price">$${p.price}</div>
            <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
        `;
        grid.appendChild(card);
    });
    
    // Add click listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            addToCart(id);
        });
    });
}

// Add item to cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

// Update cart display
function updateCart() {
    const cartDiv = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    
    if (!cartDiv || !cartCount) return;
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // If cart is empty
    if (cart.length === 0) {
        cartDiv.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        document.getElementById('subtotal').textContent = '0';
        document.getElementById('total').textContent = '0';
        document.getElementById('discountAmount').textContent = '0';
        return;
    }
    
    // Display cart items
    cartDiv.innerHTML = '';
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>${item.emoji} ${item.name} - $${item.price}</div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        `;
        cartDiv.appendChild(div);
    });
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('total').textContent = subtotal.toFixed(2);
    document.getElementById('discountAmount').textContent = '0';
    
    // Add event listeners for quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const change = parseInt(this.dataset.change);
            const item = cart.find(i => i.id === id);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    cart = cart.filter(i => i.id !== id);
                }
                updateCart();
            }
        });
    });
    
    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            cart = cart.filter(i => i.id !== id);
            updateCart();
        });
    });
}

// Apply discount
document.getElementById('applyDiscountBtn')?.addEventListener('click', function() {
    const code = document.getElementById('discountCode').value.toUpperCase();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    
    if (code === 'SAVE10') {
        discount = subtotal * 0.1;
    } else if (code === 'SAVE20') {
        discount = subtotal * 0.2;
    } else {
        alert('Invalid code! Try SAVE10 or SAVE20');
        return;
    }
    
    document.getElementById('discountAmount').textContent = discount.toFixed(2);
    document.getElementById('total').textContent = (subtotal - discount).toFixed(2);
    alert('Discount applied! You saved $' + discount.toFixed(2));
});

// Checkout modal
const modal = document.getElementById('checkoutModal');
document.getElementById('checkoutBtn')?.addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    if (modal) modal.style.display = 'block';
});

document.querySelector('.close')?.addEventListener('click', function() {
    if (modal) modal.style.display = 'none';
});

document.getElementById('checkoutForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Order placed successfully! Thank you for shopping!');
    cart = [];
    updateCart();
    if (modal) modal.style.display = 'none';
    this.reset();
});

window.onclick = function(e) {
    if (e.target === modal) modal.style.display = 'none';
};

// Initialize the page
displayProducts();
updateCart();

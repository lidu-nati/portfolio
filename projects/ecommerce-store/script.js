const products = [
    { id: 1, name: 'Laptop', price: 999, emoji: '💻' },
    { id: 2, name: 'Headphones', price: 199, emoji: '🎧' },
    { id: 3, name: 'T-Shirt', price: 29, emoji: '👕' },
    { id: 4, name: 'Sneakers', price: 89, emoji: '👟' },
    { id: 5, name: 'Coffee Mug', price: 15, emoji: '☕' }
];

let cart = [];

function displayProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-image">${p.emoji}</div>
            <div class="product-title">${p.name}</div>
            <div class="product-price">$${p.price}</div>
            <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
        </div>
    `).join('');
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        });
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    const cartDiv = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartDiv.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        document.getElementById('subtotal').textContent = '0';
        document.getElementById('total').textContent = '0';
        return;
    }
    
    cartDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>${item.emoji} ${item.name} - $${item.price}</div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('subtotal').textContent = subtotal;
    document.getElementById('total').textContent = subtotal;
    
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const change = parseInt(btn.dataset.change);
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
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            cart = cart.filter(i => i.id !== id);
            updateCart();
        });
    });
}

document.getElementById('applyDiscountBtn')?.addEventListener('click', () => {
    const code = document.getElementById('discountCode').value.toUpperCase();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    
    if (code === 'SAVE10') discount = subtotal * 0.1;
    else if (code === 'SAVE20') discount = subtotal * 0.2;
    else {
        alert('Invalid code! Try SAVE10 or SAVE20');
        return;
    }
    
    document.getElementById('discountAmount').textContent = discount.toFixed(2);
    document.getElementById('total').textContent = (subtotal - discount).toFixed(2);
    alert(`Discount applied! You saved $${discount.toFixed(2)}`);
});

const modal = document.getElementById('checkoutModal');
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    modal.style.display = 'block';
});

document.querySelector('.close')?.addEventListener('click', () => {
    modal.style.display = 'none';
});

document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Order placed successfully! Thank you for shopping!');
    cart = [];
    updateCart();
    modal.style.display = 'none';
    document.getElementById('checkoutForm').reset();
});

window.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
};

displayProducts();
updateCart();

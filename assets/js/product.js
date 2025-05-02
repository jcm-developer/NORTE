document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id == productId);
            if (!product) {
                document.getElementById('product-detail').innerHTML = '<p>Product not found</p>';
                return;
            }

            const hasDiscount = product.discount && product.discount > 0;
            const finalPrice = hasDiscount
                ? (product.price * (1 - product.discount / 100)).toFixed(2)
                : product.price.toFixed(2);

            document.getElementById('product-detail').innerHTML = `
                <div class="product-detail-container">
                    <div class="product-image-container">
                        <img src="${product.image}" alt="${product.name}" id="product-image" />
                    </div>
                    <div class="product-info">
                        <h2 id="product-name">${product.name}</h2>
                        <p id="product-description">${product.description}</p>
                        <p class="price" id="product-price">
                            ${hasDiscount
                    ? `<span class='old-price'>${product.price.toFixed(2)}€</span> <span class='new-price'>${finalPrice}€</span>`
                    : `<span class='new-price'>${finalPrice}€</span>`
                }
                        </p>
                        <label for="quantity">Quantity:</label>
                        <input type="number" id="quantity" name="quantity" min="1" value="1" class="quantity-input">
                        <button class="button-primary" id="add-to-cart-btn">Add to Cart</button>
                    </div>
                </div>
            `;

            document.getElementById('add-to-cart-btn').addEventListener('click', () => {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const quantity = parseInt(document.getElementById('quantity').value) || 1;

                const existingItem = cart.find(item => item.id === product.id);
                if (existingItem) {
                    existingItem.qty += quantity;
                } else {
                    cart.push({ id: product.id, qty: quantity });
                }

                localStorage.setItem('cart', JSON.stringify(cart));

                // Animate cart icon
                const cartIcon = document.getElementById('cart-icon');
                if (cartIcon) {
                    cartIcon.classList.add('animate');
                    setTimeout(() => cartIcon.classList.remove('animate'), 400);
                }

                // Update cart count
                updateCartCount();
            });
        });
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    const countElement = document.getElementById('cart-count');
    if (countElement) countElement.textContent = totalQty;
}
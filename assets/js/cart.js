document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            let total = 0;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
                checkoutBtn.disabled = true;
                return;
            }

            cart.forEach(cartItem => {
                const product = products.find(p => p.id === cartItem.id);
                if (!product) return;

                const hasDiscount = product.discount && product.discount > 0;
                const finalPrice = hasDiscount
                    ? (product.price * (1 - product.discount / 100)).toFixed(2)
                    : product.price.toFixed(2);

                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';

                itemElement.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="cart-item-details">
                        <h3>${product.name}</h3>
                        <p>$${finalPrice}</p>
                        <p>Quantity: ${cartItem.qty || 1}</p>
                    </div>
                    <button class="remove-vertical-btn" data-id="${product.id}">Remove</button>
                `;

                cartItemsContainer.appendChild(itemElement);
                total += parseFloat(finalPrice) * (cartItem.qty || 1);
            });

            cartTotalElement.textContent = `$${total.toFixed(2)}`;
        });

    document.addEventListener('click', e => {
        const removeBtn = e.target.closest('.remove-vertical-btn');
        if (removeBtn) {
            const idToRemove = parseInt(removeBtn.dataset.id);
            cart = cart.filter(item => item.id !== idToRemove);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        }
    });

    // checkoutBtn.addEventListener('click', () => {
    //     alert("Checkout functionality is not implemented.");
    // });
});
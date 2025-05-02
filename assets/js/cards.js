fetch('products.json')
    .then(response => response.json())
    .then(products => {
        const productList = document.getElementById('product-list');
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            const hasDiscount = product.discount && product.discount > 0;
            const discountedPrice = hasDiscount
                ? (product.price * (1 - product.discount / 100)).toFixed(2)
                : product.price.toFixed(2);

            let badgeHTML = '';
            if (product.id === 4 && product.discount > 0) {
                badgeHTML = `<div class="product-badge">${product.discount}% OFF</div>`;
            } else if (![2, 3].includes(product.id)) {
                badgeHTML = `<div class="product-badge">New</div>`;
            }

            productCard.innerHTML = `
                ${badgeHTML}
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="product-price">
                    ${hasDiscount
                    ? `<span class="old-price">${product.price.toFixed(2)}€</span> <span class="new-price">${discountedPrice}€</span>`
                    : `<span class="new-price">${discountedPrice}€</span>`
                }
                </p>
                <a href="product.html?id=${product.id}">View product</a>
            `;

            productList.appendChild(productCard);
        });
    });
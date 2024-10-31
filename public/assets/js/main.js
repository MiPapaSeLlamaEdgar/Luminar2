    document.addEventListener('DOMContentLoaded', () => {
    // Cart and Wishlist buttons
    const cartButtons = document.querySelectorAll('.cart__btn');
    const wishlistButtons = document.querySelectorAll('.action__btn[aria-label="Add to Wishlist"]');

    // Cart functionality
    cartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            
            const productItem = button.closest('.product__item');
            const productName = productItem.querySelector('.product__title').textContent;
            const productPrice = parseFloat(productItem.querySelector('.new__price').textContent.replace('$', ''));
            const productImage = productItem.querySelector('.product__img.default').src;
            
            try {
                const response = await fetch('/api/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombre_producto: productName,
                        precio: productPrice,
                        imagen: productImage,
                        cantidad: 1
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    showNotification('Producto añadido al carrito', 'success');
                    updateCartCount();
                } else {
                    showNotification(data.message || 'Error al añadir al carrito', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error al añadir al carrito', 'error');
            }
        });
    });

    // Wishlist functionality
    wishlistButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            
            const productItem = button.closest('.product__item');
            const productName = productItem.querySelector('.product__title').textContent;
            const productPrice = parseFloat(productItem.querySelector('.new__price').textContent.replace('$', ''));
            const productImage = productItem.querySelector('.product__img.default').src;
            
            try {
                const response = await fetch('/api/wishlist/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombre_producto: productName,
                        precio: productPrice,
                        imagen: productImage
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    button.classList.toggle('active');
                    showNotification(data.message, 'success');
                    updateWishlistCount();
                } else {
                    showNotification(data.message || 'Error al actualizar la lista de deseos', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error al actualizar la lista de deseos', 'error');
            }
        });
    });

    // Quick View functionality
    const quickViewButtons = document.querySelectorAll('.action__btn[aria-label="Quick View"]');
    quickViewButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            // Implement quick view modal logic here
        });
    });

    // Utility functions
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    async function updateCartCount() {
        try {
            const response = await fetch('/api/cart/count');
            if (response.ok) {
                const data = await response.json();
                const cartCount = document.querySelector('.header__action-btn[href="/cart"] .count');
                if (cartCount) {
                    cartCount.textContent = data.count;
                }
            }
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    }

    async function updateWishlistCount() {
        try {
            const response = await fetch('/api/wishlist/count');
            if (response.ok) {
                const data = await response.json();
                const wishlistCount = document.querySelector('.header__action-btn[href="/whishlist"] .count');
                if (wishlistCount) {
                    wishlistCount.textContent = data.count;
                }
            }
        } catch (error) {
            console.error('Error updating wishlist count:', error);
        }
    }

    // Initialize counts on page load
    updateCartCount();
    updateWishlistCount();
    });
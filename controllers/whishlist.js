document.addEventListener('DOMContentLoaded', () => {
    // Load wishlist items for a specific clienteId (this should be set based on your app logic)
    const clienteId = /* Retrieve clienteId from session or context */;
    loadWishlistItems(clienteId); // Load wishlist items when the page loads

    // Add events to "Add to Wishlist" buttons
    const wishlistButtons = document.querySelectorAll('.action__btn[aria-label="Add to Wishlist"]');

    wishlistButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productItem = button.closest('.product__item');
            const productName = productItem.querySelector('.product__title').textContent;
            const productImage = productItem.querySelector('.default').src;

            const product = {
                name: productName,
                image: productImage,
                cliente_id: clienteId // Include cliente ID for wishlist association
            };

            addToWishlist(product);
        });
    });

    async function addToWishlist(product) {
        try {
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });

            if (response.ok) {
                alert(`${product.name} ha sido añadido a la lista de deseos.`);
                loadWishlistItems(product.cliente_id); // Refresh the wishlist
            } else {
                alert('Error al añadir el producto a la lista de deseos.');
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    }

    async function loadWishlistItems(clienteId) {
        try {
            const response = await fetch(`/api/wishlist/${clienteId}`);
            if (!response.ok) throw new Error('Error fetching wishlist items');

            const wishlistItems = await response.json();
    
            const wishlistItemsBody = document.getElementById('wishlistItemsBody');
            wishlistItemsBody.innerHTML = ''; // Clear existing items
    
            wishlistItems.forEach(item => {
                const row = document.createElement('tr');
                row.setAttribute('data-product-id', item.producto_id);
                row.innerHTML = `
                    <td>
                        <div class="wishlist__product">
                            <img src="${item.producto.imagen}" alt="${item.producto.nombre}" class="wishlist__product-img">
                            <span class="wishlist__product-name">${item.producto.nombre}</span>
                        </div>
                    </td>
                    <td><button class="btn btn-remove">Eliminar</button></td>
                `;
                wishlistItemsBody.appendChild(row);
            });
        } catch (error) {
            console.error('Failed to load wishlist items:', error);
        }
    }

    // Event listener for removing a product from the wishlist
    document.querySelector('.wishlist__content').addEventListener('click', event => {
        if (event.target.classList.contains('btn-remove')) {
            const row = event.target.closest('tr');
            
            // Optionally, remove from local storage or database here
            
            row.remove();
        }
    });
});
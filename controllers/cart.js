document.addEventListener('DOMContentLoaded', () => {
    // Load cart items for a specific clienteId (this should be set based on your app logic)
    const clienteId = /* Retrieve clienteId from session or context */;
    loadCartItems(clienteId); // Load cart items when the page loads

    // Add events to "Add To Cart" buttons
    const cartButtons = document.querySelectorAll('.cart__btn');

    cartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const productItem = button.closest('.product__item');
            const productName = productItem.querySelector('.product__title').textContent;
            const productPrice = parseFloat(productItem.querySelector('.new__price').textContent.replace('$', '')); // Ensure it's a number
            const productImage = productItem.querySelector('.default').src;

            const product = {
                name: productName,
                price: productPrice,
                image: productImage,
                cliente_id: clienteId // Include cliente ID for cart association
            };

            await addToCart(product);
        });
    });

    async function addToCart(product) {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });

            if (response.ok) {
                alert(`${product.name} ha sido añadido al carrito.`);
            } else {
                alert('Error al añadir el producto al carrito.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    }

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
            };

            addToWishlist(product);
        });
    });

    function addToWishlist(product) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (!wishlist.some(item => item.name === product.name)) {
            wishlist.push(product);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            alert(`${product.name} ha sido añadido a la lista de deseos.`);
        } else {
            alert(`${product.name} ya está en la lista de deseos.`);
        }
    }

    async function loadCartItems(clienteId) {
        try {
            const response = await fetch(`/api/cart/${clienteId}`);
            if (!response.ok) throw new Error('Error fetching cart items');

            const cartItems = await response.json();
    
            const cartItemsBody = document.getElementById('cartItemsBody');
            cartItemsBody.innerHTML = ''; // Clear existing items
    
            cartItems.forEach(item => {
                const row = document.createElement('tr');
                row.setAttribute('data-product-id', item.producto_id);
                row.innerHTML = `
                    <td>
                        <div class="cart__product">
                            <img src="${item.producto.imagen}" alt="${item.producto.nombre}" class="cart__product-img">
                            <span class="cart__product-name">${item.producto.nombre}</span>
                        </div>
                    </td>
                    <td class="cart__price">$${item.producto.precio.toFixed(2)}</td>
                    <td><input type="number" class="cart__quantity" value="${item.cantidad}" min="1"></td>
                    <td class="cart__total-item">$${(item.producto.precio * item.cantidad).toFixed(2)}</td>
                    <td><button class="btn btn-remove">Eliminar</button></td>
                `;
                cartItemsBody.appendChild(row);
            });
    
            updateCartTotal(); // Update total after loading items
        } catch (error) {
            console.error('Failed to load cart items:', error);
        }
    }

    // Function to update the total price of the cart
    function updateCartTotal() {
        let total = 0;
        document.querySelectorAll('.cart__table tbody tr').forEach(row => {
            const price = parseFloat(row.querySelector('.cart__price').textContent.replace('$', ''));
            const quantity = parseInt(row.querySelector('.cart__quantity').value);
            const totalItem = price * quantity;
            
            // Update the total item price in the row
            row.querySelector('.cart__total-item').textContent = `$${totalItem.toFixed(2)}`;
            
            // Accumulate the total
            total += totalItem;
        });
        
        // Update the total amount displayed
        document.getElementById('cartTotalAmount').textContent = `$${total.toFixed(2)}`;
    }

    // Event listener for quantity change
    document.querySelector('.cart__content').addEventListener('change', event => {
        if (event.target.classList.contains('cart__quantity')) {
            updateCartTotal();
        }
    });

    // Event listener for removing a product
    document.querySelector('.cart__content').addEventListener('click', event => {
        if (event.target.classList.contains('btn-remove')) {
            const row = event.target.closest('tr');
            
            // Optionally, remove from local storage or database here
            
            row.remove();
            updateCartTotal();
        }
    });

    // Quick view functionality
    const quickViewButtons = document.querySelectorAll('.action__btn[aria-label="Quick View"]');
    const modal = document.getElementById('quickViewModal');
    const modalClose = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');

    quickViewButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productItem = button.closest('.product__item');
            const productName = productItem.querySelector('.product__title').textContent;
            const productPrice = productItem.querySelector('.new__price').textContent;
            const productImage = productItem.querySelector('.default').src;

            modalTitle.textContent = productName;
            modalPrice.textContent = `Precio: ${productPrice}`;
            modalImage.src = productImage;

            modal.style.display = 'block';
        });
    });

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
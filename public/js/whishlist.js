// controllers/wishlist.controller.js
document.addEventListener('DOMContentLoaded', function() {
    const wishlistContainer = document.getElementById('wishlistItemsBody');
    const emptyMessage = document.getElementById('emptyWishlistMessage');
    const loadingMessage = document.getElementById('loadingMessage');
    const clienteId = localStorage.getItem('cliente_id');
    const token = localStorage.getItem('token');


    // Función para mostrar notificaciones
    const showNotification = (message, type = 'success') => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: type,
            title: message
        });
    };

    // Función para actualizar el contador
    const updateWishlistCount = async () => {
        try {
            const response = await fetch(`/api/wishlist/cliente/${clienteId}/count`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Error al obtener contador');
            
            const data = await response.json();
            document.querySelectorAll('.count').forEach(element => {
                element.textContent = data.count || '0';
            });
        } catch (error) {
            console.error('Error al actualizar contador:', error);
        }
    };

    // Función para cargar los items de la lista de deseos
    const loadWishlistItems = async () => {
        try {
            loadingMessage.style.display = 'block';
            wishlistContainer.style.display = 'none';
            emptyMessage.style.display = 'none';

            const response = await fetch(`/api/wishlist/cliente/${clienteId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al cargar items');

            const items = await response.json();

            if (items.length === 0) {
                loadingMessage.style.display = 'none';
                wishlistContainer.style.display = 'none';
                emptyMessage.style.display = 'block';
                return;
            }

            wishlistContainer.innerHTML = items.map(item => `
                <div class="product__item" data-id="${item.producto_id}">
                    <div class="product__banner">
                        <a href="/product/${item.Producto.producto_id}" class="product__images">
                            <img src="${JSON.parse(item.Producto.imagenes)[0]}" alt="${item.Producto.nombre_producto}" class="product__img">
                        </a>
                    </div>
                    <div class="product__content">
                        <span class="product__category">${item.Producto.Categoria?.nombre_categoria || 'Sin categoría'}</span>
                        <a href="/product/${item.Producto.producto_id}">
                            <h3 class="product__title">${item.Producto.nombre_producto}</h3>
                        </a>
                        <div class="product__price flex">
                            <span class="new__price">$${item.Producto.precio.toLocaleString()}</span>
                        </div>
                        <div class="product__buttons">
                            <button class="action__btn remove-from-wishlist" aria-label="Remove from Wishlist">
                                <i class="fi fi-rs-trash"></i>
                            </button>
                            <button class="action__btn add-to-cart" aria-label="Add to Cart" 
                                ${item.Producto.cantidad_stock <= 0 ? 'disabled' : ''}>
                                <i class="fi fi-rs-shopping-cart"></i>
                            </button>
                        </div>
                        ${item.Producto.cantidad_stock <= 0 ? '<span class="out-of-stock">Agotado</span>' : ''}
                        ${item.notificar_disponibilidad ? '<span class="notify-stock">Notificar cuando esté disponible</span>' : ''}
                    </div>
                </div>
            `).join('');

            loadingMessage.style.display = 'none';
            wishlistContainer.style.display = 'grid';
            attachButtonListeners();

        } catch (error) {
            console.error('Error al cargar items:', error);
            showNotification('Error al cargar la lista de deseos', 'error');
            loadingMessage.style.display = 'none';
            emptyMessage.style.display = 'block';
        }
    };

    // Función para agregar event listeners a los botones
    const attachButtonListeners = () => {
        // Botones de eliminar de la lista
        document.querySelectorAll('.remove-from-wishlist').forEach(button => {
            button.addEventListener('click', async function() {
                const productItem = this.closest('.product__item');
                const productId = productItem.dataset.id;

                try {
                    const response = await fetch(`/api/wishlist/${productId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) throw new Error('Error al eliminar item');

                    const data = await response.json();
                    showNotification(data.message);
                    
                    productItem.remove();
                    updateWishlistCount();
                    
                    if (wishlistContainer.children.length === 0) {
                        wishlistContainer.style.display = 'none';
                        emptyMessage.style.display = 'block';
                    }

                } catch (error) {
                    console.error('Error:', error);
                    showNotification('Error al eliminar el producto', 'error');
                }
            });
        });

        // Botones de agregar al carrito
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', async function() {
                if (this.disabled) return;

                const productItem = this.closest('.product__item');
                const productId = productItem.dataset.id;

                try {
                    const response = await fetch('/api/cart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            cliente_id: clienteId,
                            producto_id: productId,
                            cantidad: 1
                        })
                    });

                    if (!response.ok) throw new Error('Error al agregar al carrito');

                    const data = await response.json();
                    showNotification(data.message);

                } catch (error) {
                    console.error('Error:', error);
                    showNotification('Error al agregar al carrito', 'error');
                }
            });
        });
    };

    // Inicializar
    loadWishlistItems();
    updateWishlistCount();
});
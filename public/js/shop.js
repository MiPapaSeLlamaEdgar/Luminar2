// public/js/shop.js
class ShopController {
    constructor() {
        this.API_ROUTES = {
            products: '/api/productos',
            categories: '/api/categories',
            cart: '/api/cart',
            wishlist: '/api/wishlist'
        };
        this.clienteId = localStorage.getItem('cliente_id');
        this.token = localStorage.getItem('token');
        this.productsContainer = document.querySelector('.products__container');
        this.searchInput = document.querySelector('.form__input');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.sortSelect = document.getElementById('sortSelect');
        this.currentFilters = {
            search: '',
            category: '',
            sort: 'newest'
        };

        this.initialize();
    }

    async initialize() {
        try {
            await this.loadCategories();
            await this.loadProducts();
            this.setupEventListeners();
            this.updateCounters();
        } catch (error) {
            console.error('Error al inicializar:', error);
            this.showNotification('Error al cargar la tienda', 'error');
        }
    }

    setupEventListeners() {
        // Búsqueda
        this.searchInput?.addEventListener('input', debounce(() => {
            this.currentFilters.search = this.searchInput.value;
            this.loadProducts();
        }, 500));

        // Filtro por categoría
        this.categoryFilter?.addEventListener('change', () => {
            this.currentFilters.category = this.categoryFilter.value;
            this.loadProducts();
        });

        // Ordenamiento
        this.sortSelect?.addEventListener('change', () => {
            this.currentFilters.sort = this.sortSelect.value;
            this.loadProducts();
        });
    }

    async loadCategories() {
        try {
            const response = await fetch(this.API_ROUTES.categories);
            if (!response.ok) throw new Error('Error al cargar categorías');

            const categories = await response.json();
            
            if (this.categoryFilter) {
                this.categoryFilter.innerHTML = `
                    <option value="">Todas las categorías</option>
                    ${categories.map(cat => `
                        <option value="${cat.categoria_id}">${cat.nombre_categoria}</option>
                    `).join('')}
                `;
            }
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al cargar categorías', 'error');
        }
    }

    async loadProducts() {
        try {
            let url = new URL(this.API_ROUTES.products, window.location.origin);
            
            // Añadir filtros a la URL
            if (this.currentFilters.search) {
                url.searchParams.append('search', this.currentFilters.search);
            }
            if (this.currentFilters.category) {
                url.searchParams.append('category', this.currentFilters.category);
            }
            url.searchParams.append('sort', this.currentFilters.sort);

            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al cargar productos');

            const products = await response.json();
            this.renderProducts(products);

        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al cargar productos', 'error');
        }
    }

    renderProducts(products) {
        if (!this.productsContainer) return;

        this.productsContainer.innerHTML = products.map(product => `
            <div class="product__item" data-id="${product.producto_id}">
                <div class="product__banner">
                    <a href="/product/${product.producto_id}" class="product__images">
                        ${this.renderProductImages(product.imagenes)}
                    </a>
                    ${this.renderProductBadges(product)}
                </div>
                <div class="product__content">
                    <span class="product__category">${product.Categoria?.nombre_categoria || 'Sin categoría'}</span>
                    <a href="/product/${product.producto_id}">
                        <h3 class="product__title">${product.nombre_producto}</h3>
                    </a>
                    <div class="product__price flex">
                        <span class="new__price">$${product.precio.toLocaleString()}</span>
                    </div>
                    <div class="product__buttons">
                        <button class="action__btn add-to-wishlist" aria-label="Add to Wishlist"
                            ${!this.clienteId ? 'disabled' : ''}>
                            <i class="fi fi-rs-heart"></i>
                        </button>
                        <button class="action__btn add-to-cart" aria-label="Add to Cart"
                            ${product.cantidad_stock <= 0 || !this.clienteId ? 'disabled' : ''}>
                            <i class="fi fi-rs-shopping-cart"></i>
                        </button>
                    </div>
                    ${product.cantidad_stock <= 0 ? '<span class="out-of-stock">Agotado</span>' : ''}
                </div>
            </div>
        `).join('');

        this.setupProductButtons();
    }

    renderProductImages(imagenes) {
        try {
            const images = JSON.parse(imagenes);
            return `
                <img src="${images[0]}" alt="Product Image" class="product__img default">
                ${images[1] ? `<img src="${images[1]}" alt="Product Image Hover" class="product__img hover">` : ''}
            `;
        } catch (error) {
            return '<img src="/assets/img/no-image.jpg" alt="No Image" class="product__img default">';
        }
    }

    renderProductBadges(product) {
        const badges = [];
        if (product.cantidad_stock <= 0) {
            badges.push('<div class="product__badge light-pink">Agotado</div>');
        }
        if (product.estado === 'inactivo') {
            badges.push('<div class="product__badge light-red">Inactivo</div>');
        }
        return badges.join('');
    }

    setupProductButtons() {
        // Botones de lista de deseos
        document.querySelectorAll('.add-to-wishlist').forEach(button => {
            if (!button.disabled) {
                button.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await this.handleWishlistAction(button);
                });
            }
        });

        // Botones de carrito
        document.querySelectorAll('.add-to-cart').forEach(button => {
            if (!button.disabled) {
                button.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await this.handleCartAction(button);
                });
            }
        });
    }

    async handleWishlistAction(button) {
        try {
            const productItem = button.closest('.product__item');
            const productId = productItem.dataset.id;

            const response = await fetch(this.API_ROUTES.wishlist, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    cliente_id: this.clienteId,
                    producto_id: productId
                })
            });

            if (!response.ok) throw new Error('Error al actualizar lista de deseos');

            const data = await response.json();
            this.showNotification(data.message);
            this.updateCounters();
            
            button.classList.toggle('active');

        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al actualizar lista de deseos', 'error');
        }
    }

    async handleCartAction(button) {
        try {
            const productItem = button.closest('.product__item');
            const productId = productItem.dataset.id;

            const response = await fetch(this.API_ROUTES.cart, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    cliente_id: this.clienteId,
                    producto_id: productId,
                    cantidad: 1
                })
            });

            if (!response.ok) throw new Error('Error al actualizar carrito');

            const data = await response.json();
            this.showNotification(data.message);
            this.updateCounters();

        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al actualizar carrito', 'error');
        }
    }

    async updateCounters() {
        if (!this.clienteId) return;

        try {
            // Actualizar contador de wishlist
            const wishlistResponse = await fetch(`${this.API_ROUTES.wishlist}/count/${this.clienteId}`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const wishlistData = await wishlistResponse.json();

            // Actualizar contador de carrito
            const cartResponse = await fetch(`${this.API_ROUTES.cart}/count/${this.clienteId}`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const cartData = await cartResponse.json();

            // Actualizar contadores en el DOM
            document.querySelectorAll('.count').forEach(counter => {
                if (counter.closest('a[href="/whishlist"]')) {
                    counter.textContent = wishlistData.count;
                } else if (counter.closest('a[href="/cart"]')) {
                    counter.textContent = cartData.count;
                }
            });
        } catch (error) {
            console.error('Error al actualizar contadores:', error);
        }
    }

    showNotification(message, type = 'success') {
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
    }
}

// Función de debounce para la búsqueda
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Inicializar el controlador
document.addEventListener('DOMContentLoaded', () => {
    new ShopController();
});
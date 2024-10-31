// controllers/details.controller.js
class DetailsController {
    constructor() {
        this.API_ROUTES = {
            products: '/api/productos',
            cart: '/api/cart',
            wishlist: '/api/wishlist'
        };

        this.clienteId = localStorage.getItem('cliente_id');
        this.token = localStorage.getItem('token');
        this.productId = new URLSearchParams(window.location.search).get('id');

        this.initialize();
    }

    async initialize() {
        try {
            await this.loadProductDetails();
            this.setupEventListeners();
            this.updateCounters();
        } catch (error) {
            console.error('Error al inicializar:', error);
            this.showNotification('Error al cargar detalles del producto', 'error');
        }
    }

    async loadProductDetails() {
        try {
            const response = await fetch(`${this.API_ROUTES.products}/${this.productId}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) throw new Error('Error al cargar detalles del producto');

            const product = await response.json();
            this.renderProductDetails(product);

        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al cargar detalles del producto', 'error');
        }
    }

    renderProductDetails(product) {
        // Renderizar imágenes
        const mainImage = document.querySelector('.product-image img');
        const thumbnailContainer = document.querySelector('.thumbnail-images');
        
        try {
            const images = JSON.parse(product.imagenes);
            mainImage.src = images[0];
            thumbnailContainer.innerHTML = images.map(img => `
                <img src="${img}" alt="${product.nombre_producto}" onclick="changeMainImage('${img}')">
            `).join('');
        } catch (error) {
            console.error('Error al parsear imágenes:', error);
        }

        // Renderizar información del producto
        document.querySelector('.product-title').textContent = product.nombre_producto;
        document.querySelector('.product-category').textContent = product.Categoria?.nombre_categoria || 'Sin categoría';
        document.querySelector('.new-price').textContent = `$${product.precio.toLocaleString()}`;
        document.querySelector('.product-description p').textContent = product.descripcion;

        // Renderizar opciones de talla
        const tallaSelect = document.getElementById('talla');
        if (product.talla) {
            const tallas = product.talla.split(',');
            tallaSelect.innerHTML = tallas.map(talla => `
                <option value="${talla.trim()}">${talla.trim()}</option>
            `).join('');
        }

        // Renderizar opciones de color
        const colorContainer = document.querySelector('.color-option');
        if (product.color) {
            const colores = product.color.split(',');
            colorContainer.innerHTML = `
                <h3>Color</h3>
                ${colores.map(color => `
                    <button style="background-color: ${color.trim()};" 
                            onclick="selectColor('${color.trim()}')"></button>
                `).join('')}
            `;
        }

        // Mostrar stock
        document.querySelector('.product-actions').insertAdjacentHTML('beforeend', `
            <div class="stock-info">
                En stock: ${product.cantidad_stock} unidades
                ${product.cantidad_stock <= 5 ? '<span class="low-stock">¡Últimas unidades!</span>' : ''}
            </div>
        `);

        // Configurar botones según disponibilidad
        const addToCartBtn = document.querySelector('.product-actions button');
        if (product.cantidad_stock <= 0) {
            addToCartBtn.disabled = true;
            addToCartBtn.textContent = 'Agotado';
        }
    }

    setupEventListeners() {
        // Cambio de imagen principal
        window.changeMainImage = (src) => {
            document.querySelector('.product-image img').src = src;
        };

        // Selección de color
        window.selectColor = (color) => {
            document.querySelectorAll('.color-option button').forEach(btn => {
                btn.classList.remove('selected');
            });
            event.target.classList.add('selected');
        };

        // Agregar al carrito
        document.querySelector('.product-actions button')?.addEventListener('click', async () => {
            if (!this.clienteId) {
                this.showNotification('Debe iniciar sesión para agregar al carrito', 'warning');
                return;
            }

            const cantidad = parseInt(document.querySelector('input[type="number"]').value);
            await this.addToCart(cantidad);
        });

        // Validación de cantidad
        const quantityInput = document.querySelector('input[type="number"]');
        quantityInput?.addEventListener('change', (e) => {
            const max = parseInt(e.target.max);
            const value = parseInt(e.target.value);
            if (value > max) {
                e.target.value = max;
                this.showNotification('Cantidad máxima excedida', 'warning');
            }
        });
    }

    async addToCart(cantidad) {
        try {
            const response = await fetch(this.API_ROUTES.cart, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    cliente_id: this.clienteId,
                    producto_id: this.productId,
                    cantidad: cantidad
                })
            });

            if (!response.ok) throw new Error('Error al agregar al carrito');

            const data = await response.json();
            this.showNotification(data.message);
            this.updateCounters();

        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al agregar al carrito', 'error');
        }
    }

    async updateCounters() {
        if (!this.clienteId) return;

        try {
            // Actualizar contador de carrito
            const cartResponse = await fetch(`${this.API_ROUTES.cart}/count/${this.clienteId}`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const cartData = await cartResponse.json();

            // Actualizar contador en el DOM
            document.querySelectorAll('.count').forEach(counter => {
                if (counter.closest('a[href="/cart"]')) {
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

// Inicializar el controlador
document.addEventListener('DOMContentLoaded', () => {
    new DetailsController();
});
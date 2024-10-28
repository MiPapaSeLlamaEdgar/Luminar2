// public/js/orders.js
class OrdersController {
    constructor() {
        this.API_ROUTES = {
            orders: '/api/orders',
            orderTracking: '/api/orders/tracking',
            cart: '/api/cart'
        };
    }

    async initialize() {
        try {
            // Verificar autenticación
            if (!this.clienteId || !this.token) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Acceso Denegado',
                    text: 'Por favor, inicia sesión para ver tus pedidos',
                    confirmButtonText: 'Iniciar Sesión'
                }).then(() => {
                    window.location.href = '/';
                });
                return;
            }

            // Mostrar loader
            this.showLoader();

            // Cargar pedidos
            await this.loadOrders();
            
            // Ocultar loader
            this.hideLoader();

        } catch (error) {
            console.error('Error de inicialización:', error);
            this.showNotification('Error al cargar los pedidos', 'error');
            this.hideLoader();
        }
    }

    showLoader() {
        const loader = document.createElement('div');
        loader.id = 'orders-loader';
        loader.innerHTML = `
            <div class="loader-container">
                <div class="loader"></div>
                <p>Cargando pedidos...</p>
            </div>
        `;
        document.querySelector('.container').appendChild(loader);
    }

    hideLoader() {
        const loader = document.getElementById('orders-loader');
        if (loader) loader.remove();
    }

    async loadOrders() {
        try {
            const response = await fetch(`${this.API_ROUTES.orders}/cliente/${this.clienteId}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) throw new Error('Error al cargar pedidos');

            const orders = await response.json();

            if (orders.length === 0) {
                this.showEmptyState();
                return;
            }

            this.renderOrders(orders);
            this.attachEventListeners();

        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al cargar los pedidos', 'error');
        }
    }

    showEmptyState() {
        this.ordersTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5">
                    <div class="empty-state">
                        <i class="fi fi-rr-shopping-bag" style="font-size: 3rem; color: var(--text-color-light);"></i>
                        <h3>No tienes pedidos aún</h3>
                        <p>¡Explora nuestra tienda y realiza tu primer pedido!</p>
                        <a href="/shop" class="btn">Ir a la tienda</a>
                    </div>
                </td>
            </tr>
        `;
    }

    renderOrders(orders) {
        this.ordersTableBody.innerHTML = orders.map(order => `
            <tr data-order-id="${order.orden_id}">
                <td>
                    <a href="#" class="fw-bold">${order.codigo_orden}</a>
                </td>
                <td>
                    <span class="fw-normal">${this.formatProductsList(order.productos)}</span>
                </td>
                <td>
                    <span class="fw-normal">${this.formatDate(order.fecha_orden)}</span>
                </td>
                <td>
                    <span class="fw-bold">$${order.total.toLocaleString()}</span>
                </td>
                <td>
                    <span class="fw-bold ${this.getStatusClass(order.estado)}">
                        ${this.formatStatus(order.estado)}
                    </span>
                </td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-link text-dark view-details" 
                                data-order-id="${order.orden_id}">
                            <i class="fi fi-rr-eye"></i> Ver Detalles
                        </button>
                        ${order.estado !== 'cancelada' ? `
                            |
                            <button class="btn btn-link text-dark track-order" 
                                    data-order-id="${order.orden_id}">
                                <i class="fi fi-rr-truck-side"></i> Seguimiento
                            </button>
                        ` : ''}
                        ${order.estado === 'entregada' ? `
                            |
                            <button class="btn btn-link text-dark reorder" 
                                    data-order-id="${order.orden_id}">
                                <i class="fi fi-rr-refresh"></i> Reordenar
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    formatProductsList(productos) {
        if (!productos || productos.length === 0) return 'No hay productos';
        
        const productList = productos.map(p => p.nombre_producto).join(', ');
        return productList.length > 50 ? productList.substring(0, 47) + '...' : productList;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatStatus(status) {
        const statusMap = {
            'pendiente': 'Pendiente',
            'confirmada': 'Confirmada',
            'en proceso': 'En Proceso',
            'enviada': 'Enviada',
            'entregada': 'Entregada',
            'cancelada': 'Cancelada'
        };
        return statusMap[status] || status;
    }

    getStatusClass(status) {
        const classMap = {
            'pendiente': 'text-warning',
            'confirmada': 'text-info',
            'en proceso': 'text-primary',
            'enviada': 'text-info',
            'entregada': 'text-success',
            'cancelada': 'text-danger'
        };
        return classMap[status] || '';
    }

    attachEventListeners() {
        // Ver detalles
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.viewOrderDetails(button.dataset.orderId);
            });
        });

        // Seguimiento
        document.querySelectorAll('.track-order').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.trackOrder(button.dataset.orderId);
            });
        });

        // Reordenar
        document.querySelectorAll('.reorder').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.reorder(button.dataset.orderId);
            });
        });
    }

    async viewOrderDetails(orderId) {
        try {
            const response = await fetch(`${this.API_ROUTES.orders}/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) throw new Error('Error al cargar detalles');

            const order = await response.json();

            Swal.fire({
                title: `Pedido #${order.codigo_orden}`,
                html: `
                    <div class="order-details">
                        <div class="order-info">
                            <p><strong>Fecha:</strong> ${this.formatDate(order.fecha_orden)}</p>
                            <p><strong>Estado:</strong> 
                                <span class="${this.getStatusClass(order.estado)}">
                                    ${this.formatStatus(order.estado)}
                                </span>
                            </p>
                        </div>
                        <div class="order-products">
                            <h4>Productos:</h4>
                            ${order.productos.map(prod => `
                                <div class="product-item">
                                    <img src="${JSON.parse(prod.imagenes)[0]}" alt="${prod.nombre_producto}">
                                    <div class="product-info">
                                        <p class="product-name">${prod.nombre_producto}</p>
                                        <p class="product-details">
                                            Cantidad: ${prod.OrderDetail.cantidad} | 
                                            Precio: $${prod.precio.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="order-summary">
                            <p><strong>Subtotal:</strong> $${order.subtotal.toLocaleString()}</p>
                            <p><strong>Impuestos:</strong> $${order.impuestos.toLocaleString()}</p>
                            <p><strong>Descuento:</strong> $${order.descuento.toLocaleString()}</p>
                            <p class="total"><strong>Total:</strong> $${order.total.toLocaleString()}</p>
                        </div>
                        <div class="shipping-info">
                            <h4>Información de envío:</h4>
                            <p>${order.direccion_envio}</p>
                            ${order.notas ? `
                                <h4>Notas:</h4>
                                <p>${order.notas}</p>
                            ` : ''}
                        </div>
                    </div>
                `,
                width: '600px',
                showCloseButton: true,
                showConfirmButton: false
            });

        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al cargar los detalles del pedido', 'error');
        }
    }

    async trackOrder(orderId) {
        try {
            const response = await fetch(`${this.API_ROUTES.orderTracking}/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) throw new Error('Error al cargar seguimiento');

            const tracking = await response.json();

            Swal.fire({
                title: 'Seguimiento del Pedido',
                html: `
                    <div class="tracking-timeline">
                        ${tracking.map((track, index) => `
                            <div class="tracking-item ${index === tracking.length - 1 ? 'current' : ''}">
                                <div class="tracking-icon">
                                    <i class="fi fi-rr-${this.getTrackingIcon(track.estado)}"></i>
                                </div>
                                <div class="tracking-content">
                                    <div class="tracking-date">
                                        ${this.formatDate(track.fecha_actualizacion)}
                                    </div>
                                    <div class="tracking-status">
                                        ${track.estado}
                                    </div>
                                    <div class="tracking-description">
                                        ${track.descripcion}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `,
                width: '600px',
                showCloseButton: true,
                showConfirmButton: false
            });

        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al cargar el seguimiento', 'error');
        }
    }

    getTrackingIcon(status) {
        const iconMap = {
            'pendiente': 'time',
            'confirmada': 'check',
            'en proceso': 'box',
            'enviada': 'truck',
            'entregada': 'shopping-bag',
            'cancelada': 'cross'
        };
        return iconMap[status] || 'circle';
    }

    async reorder(orderId) {
        try {
            const response = await fetch(`${this.API_ROUTES.orders}/${orderId}/reorder`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) throw new Error('Error al reordenar');

            const data = await response.json();
            
            this.showNotification('Productos añadidos al carrito correctamente');
            
            // Actualizar contador del carrito
            const cartCountResponse = await fetch(`${this.API_ROUTES.cart}/count/${this.clienteId}`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            
            if (cartCountResponse.ok) {
                const cartData = await cartCountResponse.json();
                document.querySelector('a[href="/cart"] .count').textContent = cartData.count;
            }

        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al reordenar los productos', 'error');
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
    new OrdersController();
});
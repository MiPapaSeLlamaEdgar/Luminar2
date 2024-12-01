// routes/views.routes.js
const express = require('express');
const router = express.Router();
const path = require('path');

module.exports = (models) => {
    // Rutas de vistas
    const viewRoutes = {
        // Admin routes
        '/admin/dashboard': 'Admin/dashboard-admin.html',
        '/admin/roles': 'Admin/roles.html',
        '/admin/usuarios': 'Admin/usuarios.html',
        '/admin/categorias': 'Admin/categorias.html',
        
        // Cliente routes
        '/cliente/dashboard': 'Cliente/dashboard-cliente.html',
        '/cliente/perfil': 'Cliente/perfil.html',
        '/cliente/pedidos': 'Cliente/pedidos.html',
        '/cliente/wishlist': 'Cliente/wishlist.html',
        
        // Vendedor routes
        '/vendedor/dashboard': 'Vendedor/dashboard-vendedor.html',
        '/vendedor/inventario': 'Vendedor/inventario.html',
        '/vendedor/ventas': 'Vendedor/ventas.html',
        '/vendedor/clientes': 'Vendedor/clientes.html',
        '/vendedor/reportes': 'Vendedor/reportes.html',
        '/vendedor/editar-perfil': 'Vendedor/editar-perfil.html',
        '/vendedor/roles': 'Vendedor/roles.html',
        
        // General routes
        '/': 'login-register.html',
        '/index': 'index.html',
        '/cart': 'cart.html',
        '/checkout': 'checkout.html',
        '/productos': 'productos.html'
    };

    // Configurar rutas de vistas
    Object.entries(viewRoutes).forEach(([route, file]) => {
        router.get(route, (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'views', file));
        });
    });

    return router;
};
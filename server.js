// Importaciones
const express = require('express');
const path = require('path');
const { Sequelize } = require('sequelize');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }
}));

// Configuración de la base de datos
const sequelize = new Sequelize('luminar', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Inicializar modelos
const initModels = require('./models/init-models');
const models = initModels(sequelize);

// Middleware para pasar los modelos a las rutas
app.use((req, res, next) => {
    req.models = models;
    next();
});

// Definir rutas disponibles para la API
const apiRoutes = {
    'role': '/api/role',
    'product': '/api/product',
    'cart': '/api/cart',
    'client': '/api/client',
    'order': '/api/order',
    'payment': '/api/payment',
    'category': '/api/category',
    'user': '/api/user',
    'orderDetail': '/api/orderDetail',
    'wishlist': '/api/wishlist',
    'orderTracking': '/api/orderTracking'
};

const viewRoutes = {
    '/': 'views/login-register.html',
    '/index': 'views/index.html',
    '/indexCliente': 'views/Cliente/indexCliente.html',
    '/cartCliente': 'views/Cliente/cartCliente.html',
    '/editarperfilCliente': 'views/Cliente/editarperfilCliente.html',
    '/ordersCliente': 'views/Cliente/ordersCliente.html',
    '/shopCliente': 'views/Cliente/shopCliente.html',
    '/whishlistCliente': 'views/Cliente/wishlistCliente.html',
    '/vendedor/clientes': 'views/Vendedor/clientes.html',
    '/vendedor/dashboard-vendedor': 'views/Vendedor/dashboard-vendedor.html',
    '/vendedor/editar-perfil': 'views/Vendedor/editar-perfil.html',
    '/vendedor/inventario': 'views/Vendedor/inventario.html',
    '/vendedor/reportes': 'views/Vendedor/reportes.html',
    '/vendedor/ventas': 'views/Vendedor/ventas.html',
    '/vendedor/nueva-venta': 'views/Vendedor/nueva-venta.html',
    '/vendedor/nuevo-cliente': 'views/Vendedor/nuevo-cliente.html',
    '/vendedor/nuevo-producto': 'views/Vendedor/nuevo-producto.html',
    '/dashboard-admin': 'views/Admin/dashboard-admin.html',
    '/admin/roles': 'views/Admin/roles.html',
    '/admin/clientes': 'views/Admin/clientes.html',
    '/admin/config': 'views/Admin/config-admin.html',
    '/admin/editar-perfil': 'views/Admin/editar-perfil.html',
    '/admin/inventario': 'views/Admin/inventario.html',
    '/admin/notificaciones': 'views/Admin/notificaciones.html',
    '/admin/ordenes': 'views/Admin/ordenes.html',
    '/admin/pedidos': 'views/Admin/pedidos.html',
    '/admin/productos': 'views/Admin/productos.html',
    '/admin/reportes': 'views/Admin/reportes.html',
    '/admin/usuarios': 'views/Admin/usuarios.html',
    '/admin/ventas': 'views/Admin/ventas.html',
    '/privacy-policy': 'views/privacy-policy.html',
    '/indexPortal': 'views/indexPortal.html',
    '/shopPortal': 'views/shopPortal.html',
    '/details': 'views/details.html',
    '/forget-password': 'views/forget-password.html',
    '/recuperar-password': 'views/recuperar-contraseña.html'
};

function loadRoute(routeName) {
    const routeFile = `./routes/${routeName}.routes.js`;
    try {
        const routeModule = require(routeFile);
        return routeModule(models);
    } catch (error) {
        console.warn(`Error al cargar la ruta '${routeFile}': ${error.message}`);
        return express.Router();
    }
}

// Configurar rutas API
Object.entries(apiRoutes).forEach(([routeName, routePath]) => {
    const router = loadRoute(routeName);
    app.use(routePath, router);
});

Object.entries(viewRoutes).forEach(([route, file]) => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, file));
    });
});

app.get('/detailsCliente/:producto_id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/Cliente/detailsCliente.html'));
});

// Error handling for 404s
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Global error handler
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message,
            status: err.status || 500,
            ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
        }
    });
});

async function initializeServer() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida.');
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados.');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
            console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Error de inicialización:', error);
        process.exit(1);
    }
}

initializeServer();

module.exports = app;

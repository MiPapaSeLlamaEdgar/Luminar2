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
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Configuración de la base de datos
const sequelize = new Sequelize('Luminar', 'root', '1234', {
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

// Definir rutas disponibles
const availableRoutes = {
    'role': '/api/roles',
    'product': '/api/productos',
    'cart': '/api/cart',
    'client': '/api/clients',
    'order': '/api/orders',
    'payment': '/api/payments',
    'category': '/api/categories',
    'user': '/api/users',
    'orderDetail': '/api/orderDetails',
    'whishlist': '/api/wishlist'
};

// Función para cargar rutas de manera segura
function loadRoute(routeName) {
    try {
        return require(`./routes/${routeName}.routes.js`)(models);
    } catch (error) {
        console.warn(`Ruta ${routeName} no encontrada`);
        return express.Router();
    }
}

// Configurar rutas API
Object.entries(availableRoutes).forEach(([routeName, path]) => {
    app.use(path, loadRoute(routeName));
});

// Configurar rutas de vistas
const viewRoutes = {
    '/': 'login-register.html',
    '/index': 'index.html',
    '/dashboard-cliente': 'Cliente/dashboard-cliente.html',
    '/Vendedor/dashboard-vendedor': 'Vendedor/dashboard-vendedor.html',
    '/dashboard-admin': 'Admin/dashboard-admin.html',
    '/accounts': 'accounts.html',
    '/cart': 'cart.html',
    '/checkout': 'checkout.html',
    '/productos': 'productos.html',
    '/shop': 'shop.html',
    '/whishlist': 'whishlist.html',
    '/orders': 'orders.html',
    '/privacy-policy': 'privacy-policy.html',
    '/vendedor/clientes': 'Vendedor/clientes.html',
    '/vendedor/dashboard': 'Vendedor/dashboard-vendedor.html',
    '/vendedor/dashboards': 'Vendedor/dashboards.html',
    '/vendedor/inventario': 'Vendedor/inventario.html',
    '/vendedor/reportes': 'Vendedor/reportes.html',
    '/vendedor/ventas': 'Vendedor/ventas.html',
    '/vendedor/editar-perfil': 'Vendedor/editar-perfil.html',
    '/admin/roles': 'Admin/roles.html'
};

// Configurar rutas de vistas
Object.entries(viewRoutes).forEach(([route, file]) => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, 'views', file));
    });
});

// Manejo de errores 404
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ 
        error: {
            message: err.message,
            status: err.status,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
    });
});

// Función para inicializar el servidor
async function initializeServer() {
    try {
        // Verificar conexión a la base de datos
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida.');
        
        // Sincronizar modelos
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados.');
        
        // Iniciar servidor
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

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

initializeServer();

module.exports = app;
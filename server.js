require('dotenv').config();
const express = require('express');
const path = require('path');
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Conexión a la base de datos
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Importar y configurar modelos
const initModels = require('./models/init-models');
const models = initModels(sequelize);

// Middleware para manejar respuestas JSON
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Importar rutas
const authRoutes = require('./controllers/auth');
const cartRoutes = require('./controllers/cart');
const wishlistRoutes = require('./controllers/whishlist');
const crudRoutes = require('./controllers/crudRoutes');
const inventoryRoutes = require('./controllers/inventorySalesRoutes');

// Configurar rutas de API
app.use('/api/auth', authRoutes(sequelize));
app.use('/api/cart', cartRoutes(sequelize));
app.use('/api/wishlist', wishlistRoutes(sequelize));
app.use('/api/crud', crudRoutes(sequelize));
app.use('/api/inventory', inventoryRoutes(sequelize));

// Rutas de vistas
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
    
    // Nuevas rutas para la sección de Vendedor
    '/vendedor/clientes': 'Vendedor/clientes.html',
    '/vendedor/dashboard': 'Vendedor/dashboard-vendedor.html',
    '/vendedor/dashboards': 'Vendedor/dashboards.html',
    '/vendedor/inventario': 'Vendedor/inventario.html',
    '/vendedor/reportes': 'Vendedor/reportes.html',
    '/vendedor/ventas': 'Vendedor/ventas.html',
    '/vendedor/editar-perfil': 'Vendedor/editar-perfil.html'
};


// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

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

// Función para inicializar modelos y relaciones
async function initializeModels() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida.');
        
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados.');
    } catch (error) {
        console.error('Error al inicializar modelos:', error);
        throw error;
    }
}

// Inicialización del servidor
async function initializeServer() {
    try {
        await initializeModels();
        
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
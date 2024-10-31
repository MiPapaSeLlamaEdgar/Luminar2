// Importaciones
const express = require('express');
const path = require('path');
const { Sequelize } = require('sequelize');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const hbs = require('hbs');
require('dotenv').config();

const app = express();

// Configuración del motor de plantillas Handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

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
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }
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
    
    // Rutas para Cliente
    '/indexCliente': 'views/Cliente/indexCliente.html',
    '/cartCliente': 'views/Cliente/cartCliente.html',
    '/detailsCliente': 'views/Cliente/detailsCliente.html',
    '/editarperfilCliente': 'views/Cliente/editarperfilCliente.html',
    '/ordersCliente': 'views/Cliente/ordersCliente.html',
    '/shopCliente': 'views/Cliente/shopCliente.html',
    '/whishlistCliente': 'views/Cliente/whishlistCliente.html',
    
    // Rutas para Vendedor
    '/vendedor/clientes': 'views/Vendedor/clientes.html',
    '/vendedor/dashboard': 'views/Vendedor/dashboard-vendedor.html',
    '/vendedor/editar-perfil': 'views/Vendedor/editar-perfil.html',
    '/vendedor/inventario': 'views/Vendedor/inventario.html',
    '/vendedor/reportes': 'views/Vendedor/reportes.html',
    '/vendedor/ventas': 'views/Vendedor/ventas.html',
    '/vendedor/nueva-venta': 'views/Vendedor/nueva-venta.html',
    '/vendedor/nuevo-cliente': 'views/Vendedor/nuevo-cliente.html',
    '/vendedor/nuevo-producto': 'views/Vendedor/nuevo-producto.html',
    
    // Rutas para Admin
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

    // Rutas adicionales
    '/privacy-policy': 'views/privacy-policy.html',
    '/indexPortal': 'views/indexPortal.html',
    '/shopPortal': 'views/shopPortal.html',
    '/details': 'views/details.html',
};

// Función para cargar rutas de manera segura
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

// Rutas específicas con lógica usando Handlebars
app.get('/admin/roles', async (req, res) => {
    try {
        const roles = await req.models.Role.findAll({ order: [['rol_id', 'ASC']] });
        res.render('roles', { roles });
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).send('Error al obtener roles');
    }
});

app.get('/vendedor/clientes', async (req, res) => {
    try {
        const clientes = await req.models.User.findAll({
            attributes: ['usuario_id', 'nombre', 'correo_electronico', 'fecha_registro', 'estado']
        });
        res.render('clientes', { clientes });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener usuarios');
    }
});



Object.entries(viewRoutes).forEach(([route, file]) => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, file));
    });
});

// Manejo de errores 404 y registro de la ruta no encontrada
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    console.log(`Ruta no encontrada: ${req.method} ${req.url}`);
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

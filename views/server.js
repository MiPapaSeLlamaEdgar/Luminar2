const express = require('express');
const path = require('path');
const { Sequelize } = require('sequelize');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const hbs = require('hbs'); // Importa Handlebars
require('dotenv').config();

const app = express();

// Configuración del motor de plantillas Handlebars
app.set('view engine', 'hbs'); // Establece Handlebars como motor de plantillas
app.set('views', path.join(__dirname, 'views')); // Define la carpeta de vistas

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

// Definir rutas disponibles para la API
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

// Configurar rutas de vistas (HTML y HBS)
const viewRoutes = {
   '/': 'views/login-register.html',
    '/index': 'views/index.html',
    '/dashboard-cliente': 'views/Cliente/dashboard-cliente.html',
    '/Vendedor/dashboard-vendedor': 'views/Vendedor/dashboard-vendedor.html',
    '/dashboard-admin': 'views/Admin/dashboard-admin.html',
    '/accounts': 'views/accounts.html',
    '/cart': 'views/cart.html',
    '/checkout': 'views/checkout.html',
    '/productos': 'views/productos.html',
    '/shop': 'views/shop.html',
    '/whishlist': 'views/whishlist.html',
    '/orders': 'views/orders.html',
    '/privacy-policy': 'views/privacy-policy.html',
    '/vendedor/clientes': 'views/Vendedor/clientes.html',
    '/vendedor/dashboard': 'views/Vendedor/dashboard-vendedor.html',
    '/vendedor/dashboards': 'views/Vendedor/dashboards.html',
    '/vendedor/inventario': 'views/Vendedor/inventario.html',
    '/vendedor/reportes': 'views/Vendedor/reportes.html',
    '/vendedor/ventas': 'views/Vendedor/ventas.html',
    '/vendedor/editar-perfil': 'views/Vendedor/editar-perfil.html',
    '/admin/roles': 'views/Admin/roles.html',
    '/editarperfilCliente': 'views/editarperfilCliente.html',
    '/shopCliente': 'views/shopCliente.html',
    '/ordersCliente': 'views/ordersCliente.html',
    '/indexCliente': 'views/indexCliente.html',
    '/detailsCliente': 'views/detailsCliente.html',
    '/whishlistCliente': 'views/whishlistCliente.html',
    '/indexPortal': 'views/indexPortal.html',
    '/shopPortal': 'views/shopPortal.html',
    '/cartCliente.html': 'views/cartCliente.html'
};

// Agregar ruta específica para roles usando Handlebars
app.get('/admin/roles', async (req, res) => {
    try {
        const roles = await req.models.Role.findAll({ order: [['rol_id', 'ASC']] });
        res.render('roles', { roles }); // Renderiza la vista roles.hbs con los datos obtenidos
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).send('Error al obtener roles');
    }
});

app.get('/clientes', async (req, res) => {
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


// Configurar otras rutas de vistas (HTML)
Object.entries(viewRoutes).forEach(([route, file]) => {
   app.get(route, (req, res) => {
       res.sendFile(path.join(__dirname, file.includes('.html') ? file : `views/${file}`));
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
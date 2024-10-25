require('dotenv').config();
const express = require('express');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();

// Middlewares para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configurar carpeta de archivos estáticos (public)
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a MySQL usando Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false // Desactivar logging SQL para menos ruido en la consola
});

// Verificar la conexión a la base de datos
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado a MySQL');
    } catch (err) {
        console.error('Error de conexión a MySQL:', err.message);
        process.exit(1); // Salir si la conexión falla
    }
})();

// Definir el modelo de Usuario
const User = sequelize.define('Usuario', {
    usuario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo_electronico: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'Usuarios',
    timestamps: false,
});

// Definir el modelo de Rol
const Role = sequelize.define('Rol', {
    rol_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_rol: {  // Cambié a nombre_rol para coincidir con tu esquema
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'Roles',
    timestamps: false,
});

// Relación entre Usuarios y Roles
User.belongsTo(Role, { foreignKey: 'rol_id', as: 'rol' });

// Sincronizar los modelos con la base de datos
(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados');
        
        // Crear administrador al iniciar el servidor
        await crearAdministrador();
        
    } catch (err) {
        console.error('Error sincronizando modelos:', err.message);
        process.exit(1); // Salir si la sincronización falla
    }
})();

// Función para crear un administrador si no existe
const crearAdministrador = async () => {
    const correo_electronico = 'Holaeric12@gmail.com';
    const contrasena = 'poiuyt098765';
    
    try {
        const adminExistente = await User.findOne({ where: { correo_electronico } });
        
        if (!adminExistente) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contrasena, salt);

            // Asignar rol_id 3 para Administrador según tu inserción en Roles
            await User.create({
                nombre: 'Eric',
                apellido: 'Hola',
                correo_electronico,
                contrasena: hashedPassword,
                rol_id: 3, // Asignar rol de Administrador (rol_id 3)
            });
            console.log('Administrador creado con éxito.');
        } else {
            console.log('El administrador ya existe.');
        }
        
    } catch (error) {
        console.error(`Error al crear el administrador: ${error.message}`);
    }
};

// Importar y usar el módulo de autenticación
try {
    const authRoutes = require('./controllers/auth')(sequelize);
    app.use('/', authRoutes);
    console.log('Rutas de autenticación cargadas correctamente.');
} catch (err) {
    console.error('Error al cargar las rutas de autenticación:', err.message);
}

// Rutas para vistas HTML
app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'views', 'login-register.html'));
    } catch (err) {
        console.error('Error al cargar la página de login/register:', err.message);
        res.status(500).json({ msg: `Error del servidor.` });
    }
});

// Endpoint to get cart items (if you decide to store them in the database)
app.get('/api/cart/:clienteId', async (req, res) => {
    const { clienteId } = req.params;

    try {
        const [results] = await sequelize.query(
            `SELECT c.cantidad, p.nombre_producto, p.precio 
             FROM Carrito c 
             JOIN Productos p ON c.producto_id = p.producto_id 
             WHERE c.cliente_id = ?`, 
             { replacements: [clienteId] }
        );
        
        res.json(results);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Endpoint to add item to cart (optional, if using a database)
app.post('/api/cart', async (req, res) => {
    const { cliente_id, producto_id, cantidad } = req.body;

    try {
        await sequelize.query(
            'INSERT INTO Carrito (cliente_id, producto_id, cantidad) VALUES (?, ?, ?)',
            { replacements: [cliente_id, producto_id, cantidad] }
        );
        res.status(201).json({ message: 'Producto añadido al carrito' });
    } catch (error) {
        console.error('Error al añadir al carrito:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});
// Endpoint to remove item from cart (optional)
app.delete('/api/cart/:id', async (req, res) => {
    const { id } = req.params;
    // Logic to remove product from the database or session storage
    res.status(200).json({ message: 'Producto eliminado del carrito' });
});

// Otras rutas...
app.get('/accounts', (req, res) => res.sendFile(path.join(__dirname, 'views', 'accounts.html')));
app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, 'views', 'cart.html')));
app.get('/checkout', (req, res) => res.sendFile(path.join(__dirname, 'views', 'checkout.html')));
app.get('/dashboard-admin', (req, res) => res.sendFile(path.join(__dirname, 'views', 'dashboard-admin.html')));
app.get('/dashboard-cliente', (req, res) => res.sendFile(path.join(__dirname, 'views', 'dashboard-cliente.html')));
app.get('/dashboard-vendedor', (req, res) => res.sendFile(path.join(__dirname, 'views', 'dashboard-vendedor.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'views', 'dashboard.html')));
app.get('/index', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/productos', (req, res) => res.sendFile(path.join(__dirname, 'views', 'productos.html')));
app.get('/shop', (req, res) => res.sendFile(path.join(__dirname, 'views', 'shop.html')));
app.get('/whishlist', (req, res) => res.sendFile(path.join(__dirname, 'views', 'whishlist.html')));
app.get('/orders', (req, res) => res.sendFile(path.join(__dirname, 'views', 'orders.html')));
app.get('/forget-password', (req, res) => res.sendFile(path.join(__dirname, 'views', 'forget-password.html')));
app.get('/privacy-policy', (req, res) => res.sendFile(path.join(__dirname, 'views', 'privacy-policy.html')));
app.get('/details', (req, res) => res.sendFile(path.join(__dirname, 'views', 'details.html')));

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
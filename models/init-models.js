// models/init-models.js
const { Sequelize, DataTypes } = require('sequelize');

// Importar solo los modelos que existen en tu base de datos
const RoleModel = require('./role.model');
const UserModel = require('./user.model');
const ClientModel = require('./client.model');
const CategoryModel = require('./category.model');
const ProductModel = require('./product.model');
const OrderModel = require('./order.model');
const OrderDetailModel = require('./orderDetail.model');
const PaymentModel = require('./payment.model');
const CartModel = require('./cart.model');
const WishlistModel = require('./wishlist.model');
const OrderTrackingModel = require('./orderTracking.model');

function initModels(sequelize) {
    // Inicializar modelos
    const Role = RoleModel(sequelize, DataTypes);
    const User = UserModel(sequelize, DataTypes);
    const Client = ClientModel(sequelize, DataTypes);
    const Category = CategoryModel(sequelize, DataTypes);
    const Product = ProductModel(sequelize, DataTypes);
    const Order = OrderModel(sequelize, DataTypes);
    const OrderDetail = OrderDetailModel(sequelize, DataTypes);
    const Payment = PaymentModel(sequelize, DataTypes);
    const Cart = CartModel(sequelize, DataTypes);
    const Wishlist = WishlistModel(sequelize, DataTypes);
    const OrderTracking = OrderTrackingModel(sequelize, DataTypes);

    // Definir relaciones según tu esquema de base de datos

    // Relaciones entre Role y User
    Role.hasMany(User, { foreignKey: 'rol_id' });
    User.belongsTo(Role, { foreignKey: 'rol_id' });

    // Relaciones entre Client y Order
    Client.hasMany(Order, { foreignKey: 'cliente_id' });
    Order.belongsTo(Client, { foreignKey: 'cliente_id' });

    // Relaciones entre User y Order (Usuario que gestiona la orden)
    User.hasMany(Order, { foreignKey: 'usuario_id', as: 'OrdenesGestionadas' });
    Order.belongsTo(User, { foreignKey: 'usuario_id', as: 'Usuario' });

    // Relaciones entre Category y Product
    Category.hasMany(Product, { foreignKey: 'categoria_id' });
    Product.belongsTo(Category, { foreignKey: 'categoria_id', as: 'Categoria' });

    // Relaciones de categorías padre-hijo
    Category.belongsTo(Category, { as: 'CategoriaPadre', foreignKey: 'categoria_padre_id' });
    Category.hasMany(Category, { as: 'SubCategorias', foreignKey: 'categoria_padre_id' });

    // Relaciones entre Client y Cart
    Client.hasMany(Cart, { foreignKey: 'cliente_id' });
    Cart.belongsTo(Client, { foreignKey: 'cliente_id' });

    // Relaciones entre Product y Cart
    Product.hasMany(Cart, { foreignKey: 'producto_id', as: 'Producto' }); 
    Cart.belongsTo(Product, { foreignKey: 'producto_id', as: 'Producto' }); 

    // Relaciones entre Client y Wishlist
    Client.hasMany(Wishlist, { foreignKey: 'cliente_id' });
    Wishlist.belongsTo(Client, { foreignKey: 'cliente_id' });

    // Relaciones entre Product y Wishlist
    Product.hasMany(Wishlist, { foreignKey: 'producto_id' });
    Wishlist.belongsTo(Product, { foreignKey: 'producto_id' });

    // Relaciones entre Order y OrderDetail
    Order.hasMany(OrderDetail, { foreignKey: 'orden_id' });
    OrderDetail.belongsTo(Order, { foreignKey: 'orden_id' });

    // Relaciones entre Product y OrderDetail
    Product.hasMany(OrderDetail, { foreignKey: 'producto_id' });
    OrderDetail.belongsTo(Product, { foreignKey: 'producto_id' });

    // Relaciones entre Order y Payment
    Order.hasMany(Payment, { foreignKey: 'orden_id' });
    Payment.belongsTo(Order, { foreignKey: 'orden_id' });

    // Relaciones entre Order y OrderTracking (Seguimiento de órdenes)
    Order.hasMany(OrderTracking, { foreignKey: 'orden_id' });
    OrderTracking.belongsTo(Order, { foreignKey: 'orden_id' });

    // Relaciones entre User y OrderTracking (Usuario que gestiona el seguimiento)
    User.hasMany(OrderTracking, { foreignKey: 'usuario_id' });
    OrderTracking.belongsTo(User, { foreignKey: 'usuario_id' });

    return {
        Role,
        User,
        Client,
        Category,
        Product,
        Order,
        OrderDetail,
        Payment,
        Cart,
        Wishlist,
        OrderTracking,
    };
}

module.exports = initModels;

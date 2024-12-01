// models/init-models.js
const { Sequelize, DataTypes } = require('sequelize');

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

    // Definir las relaciones aquí
    Role.hasMany(User, { foreignKey: 'rol_id' });
    User.belongsTo(Role, { foreignKey: 'rol_id' });

    Client.hasMany(Order, { foreignKey: 'cliente_id' });
    Order.belongsTo(Client, { foreignKey: 'cliente_id' });

    User.hasMany(Order, { foreignKey: 'usuario_id', as: 'OrdenesGestionadas' });
    Order.belongsTo(User, { foreignKey: 'usuario_id', as: 'Usuario' });

    Category.hasMany(Product, { foreignKey: 'categoria_id' });
    Product.belongsTo(Category, { foreignKey: 'categoria_id', as: 'Categoria' });

    Category.belongsTo(Category, { as: 'CategoriaPadre', foreignKey: 'categoria_padre_id' });
    Category.hasMany(Category, { as: 'SubCategorias', foreignKey: 'categoria_padre_id' });

    Client.hasMany(Cart, { foreignKey: 'cliente_id', as: 'Carritos' });
    Cart.belongsTo(Client, { foreignKey: 'cliente_id', as: 'Cliente' });

    Product.hasMany(Cart, { foreignKey: 'producto_id', as: 'Carritos' });
    Cart.belongsTo(Product, { foreignKey: 'producto_id', as: 'Producto' });

    Client.hasMany(Wishlist, { foreignKey: 'cliente_id', as: 'Wishlists' });
    Wishlist.belongsTo(Client, { foreignKey: 'cliente_id', as: 'Cliente' });

    Product.hasMany(Wishlist, { foreignKey: 'producto_id', as: 'Wishlists' });
    Wishlist.belongsTo(Product, { foreignKey: 'producto_id', as: 'Producto' });

    Order.hasMany(OrderDetail, { foreignKey: 'orden_id', as: 'Detalles' });
    OrderDetail.belongsTo(Order, { foreignKey: 'orden_id', as: 'Orden' });

    Product.hasMany(OrderDetail, { foreignKey: 'producto_id', as: 'Detalles' });
    OrderDetail.belongsTo(Product, { foreignKey: 'producto_id', as: 'Producto' });

    Order.hasMany(Payment, { foreignKey: 'orden_id', as: 'Pagos' });
    Payment.belongsTo(Order, { foreignKey: 'orden_id', as: 'Orden' });

    Order.hasMany(OrderTracking, { foreignKey: 'orden_id', as: 'Seguimientos' });
    OrderTracking.belongsTo(Order, { foreignKey: 'orden_id', as: 'Orden' });

    User.hasMany(OrderTracking, { foreignKey: 'usuario_id', as: 'SeguimientosGestionados' });
    OrderTracking.belongsTo(User, { foreignKey: 'usuario_id', as: 'Usuario' });

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

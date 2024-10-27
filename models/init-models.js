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
const WishlistModel = require('./whishlist.model');

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

    // Definir relaciones según tu esquema de base de datos
    Role.hasMany(User, { foreignKey: 'rol_id' });
    User.belongsTo(Role, { foreignKey: 'rol_id' });

    Client.hasMany(Order, { foreignKey: 'cliente_id' });
    Order.belongsTo(Client, { foreignKey: 'cliente_id' });

    Category.hasMany(Product, { foreignKey: 'categoria_id' });
    Product.belongsTo(Category, { foreignKey: 'categoria_id' });

    Category.belongsTo(Category, { as: 'CategoriaPadre', foreignKey: 'categoria_padre_id' });
    Category.hasMany(Category, { as: 'SubCategorias', foreignKey: 'categoria_padre_id' });

    Client.hasMany(Cart, { foreignKey: 'cliente_id' });
    Cart.belongsTo(Client, { foreignKey: 'cliente_id' });

    Product.hasMany(Cart, { foreignKey: 'producto_id' });
    Cart.belongsTo(Product, { foreignKey: 'producto_id' });

    Client.hasMany(Wishlist, { foreignKey: 'cliente_id' });
    Wishlist.belongsTo(Client, { foreignKey: 'cliente_id' });

    Product.hasMany(Wishlist, { foreignKey: 'producto_id' });
    Wishlist.belongsTo(Product, { foreignKey: 'producto_id' });

    Order.hasMany(OrderDetail, { foreignKey: 'orden_id' });
    OrderDetail.belongsTo(Order, { foreignKey: 'orden_id' });

    Order.hasMany(Payment, { foreignKey: 'orden_id' });
    Payment.belongsTo(Order, { foreignKey: 'orden_id' });

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
        Wishlist
    };
}

module.exports = initModels;
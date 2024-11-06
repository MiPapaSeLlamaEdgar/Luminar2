// models/cart.model.js
module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
        carrito_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        producto_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        talla: {
            type: DataTypes.STRING(50),  // New field for size
            allowNull: true
        },
        color: {
            type: DataTypes.STRING(50),  // New field for color
            allowNull: true
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_agregado: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        fecha_modificacion: {
            type: DataTypes.DATE,
            defaultValue: null
        }
    }, {
        tableName: 'Carrito',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['cliente_id', 'producto_id', 'talla', 'color']
            }
        ]
    });

    // Define association with the `Product` model using the alias `Producto`
    Cart.associate = models => {
        Cart.belongsTo(models.Product, {
            foreignKey: 'producto_id',
            as: 'Producto'  // Alias for including in routes
        });
    };

    return Cart;
};

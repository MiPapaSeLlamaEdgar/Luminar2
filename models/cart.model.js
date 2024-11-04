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
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_agregado: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        fecha_modificacion: DataTypes.DATE
    }, {
        tableName: 'Carrito',
        timestamps: false
    });

    // Definir la asociación con el modelo `Product` usando el alias `Producto`
    Cart.associate = models => {
        Cart.belongsTo(models.Product, {
            foreignKey: 'producto_id',
            as: 'Producto'  // Alias correcto para el include en las rutas
        });
    };

    return Cart;
};

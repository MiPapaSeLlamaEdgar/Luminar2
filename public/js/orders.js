// models/order.model.js
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        orden_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('pendiente', 'confirmada', 'en proceso', 'enviada', 'entregada', 'cancelada'),
            allowNull: false
        },
        fecha_orden: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Ordenes',
        timestamps: false
    });

    // Relación con el cliente
    Order.associate = models => {
        Order.belongsTo(models.Client, { foreignKey: 'cliente_id' });
        Order.hasMany(models.OrderDetail, { foreignKey: 'orden_id' });
    };

    return Order;
};

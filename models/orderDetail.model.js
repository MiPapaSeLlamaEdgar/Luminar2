// models/orderDetail.model.js

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('OrderDetail', {
        detalle_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orden_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Ordenes',
                key: 'orden_id'
            },
            onDelete: 'CASCADE',  // Si se elimina la orden, también se eliminan los detalles
            onUpdate: 'CASCADE'
        },
        producto_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Productos',
                key: 'producto_id'
            },
            onDelete: 'CASCADE',  // Si se elimina el producto, se eliminan los detalles asociados
            onUpdate: 'CASCADE'
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        precio_unitario: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        tableName: 'Order_Details', // Nombre de la tabla en la base de datos
        timestamps: false
    });
};

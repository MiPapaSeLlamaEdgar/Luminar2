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
            onDelete: 'CASCADE'
        },
        producto_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Productos',
                key: 'producto_id'
            },
            onDelete: 'CASCADE'
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'Order_Details',
        timestamps: false
    });
};

module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define('OrderDetail', {
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
            onDelete: 'CASCADE',  // Deletes associated order details if order is deleted
            onUpdate: 'CASCADE'
        },
        producto_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Productos',
                key: 'producto_id'
            },
            onDelete: 'CASCADE',  // Deletes associated details if product is deleted
            onUpdate: 'CASCADE'
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1  // Minimum quantity should be 1
            }
        },
        precio_unitario: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0.0  // Price should not be negative
            }
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
            validate: {
                min: 0.0
            }
        }
    }, {
        tableName: 'Order_Details', // Database table name
        timestamps: false,
        hooks: {
            beforeCreate(orderDetail) {
                orderDetail.total = orderDetail.cantidad * orderDetail.precio_unitario;
            },
            beforeUpdate(orderDetail) {
                orderDetail.total = orderDetail.cantidad * orderDetail.precio_unitario;
            }
        }
    });

    // Define associations
    OrderDetail.associate = (models) => {
        // Association with Order model
        OrderDetail.belongsTo(models.Order, {
            foreignKey: 'orden_id',
            as: 'Orden' // Alias used when including this association in queries
        });

        // Association with Product model
        OrderDetail.belongsTo(models.Producto, {
            foreignKey: 'producto_id',
            as: 'Producto' // Alias used when including this association in queries
        });
    };

    return OrderDetail;
};

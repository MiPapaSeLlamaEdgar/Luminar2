module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        orden_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Clientes',
                key: 'cliente_id'
            }
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Usuarios',
                key: 'usuario_id'
            }
        },
        codigo_orden: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        fecha_orden: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        fecha_entrega_estimada: {
            type: DataTypes.DATE,
            allowNull: true
        },
        fecha_entrega_real: {
            type: DataTypes.DATE,
            allowNull: true
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        impuestos: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        descuento: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('pendiente', 'confirmada', 'en proceso', 'enviada', 'entregada', 'cancelada'),
            defaultValue: 'pendiente',
            allowNull: false
        },
        direccion_envio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        notas: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'Ordenes',
        timestamps: false
    });

    // Define associations
    Order.associate = (models) => {
        // One-to-Many relationship with OrderDetail
        Order.hasMany(models.OrderDetail, {
            foreignKey: 'orden_id',
            as: 'Detalles' // Alias used to include this relationship
        });

        // Association with Cliente model if needed
        Order.belongsTo(models.Cliente, {
            foreignKey: 'cliente_id',
            as: 'Cliente'
        });

        // Association with Usuario model if needed
        Order.belongsTo(models.Usuario, {
            foreignKey: 'usuario_id',
            as: 'Usuario'
        });
    };

    return Order;
};

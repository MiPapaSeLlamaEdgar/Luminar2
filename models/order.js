const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Order = sequelize.define('Orden', {
        orden_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Clientes',
                key: 'cliente_id',
            },
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Usuarios',
                key: 'usuario_id',
            },
        },
        codigo_orden: {
            type: DataTypes.STRING(20),
            unique: true,
        },
        fecha_orden: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        fecha_entrega_estimada: {
            type: DataTypes.DATE,
        },
        fecha_entrega_real: {
            type: DataTypes.DATE,
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
        },
        impuestos: {
            type: DataTypes.DECIMAL(10, 2),
        },
        descuento: {
            type: DataTypes.DECIMAL(10, 2),
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
        },
        estado: {
            type: DataTypes.ENUM('pendiente', 'confirmada', 'en proceso', 'enviada', 'entregada', 'cancelada'),
            defaultValue: 'pendiente',
        },
        direccion_envio: {
            type: DataTypes.TEXT,
        },
        notas: {
            type: DataTypes.TEXT,
        }
    }, {
        tableName: 'Ordenes',
        timestamps: false,
    });

    return Order;
};

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Payment = sequelize.define('Pago', {
        pago_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        orden_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Ordenes',
                key: 'orden_id',
            },
        },
        codigo_pago: {
            type: DataTypes.STRING(50),
            unique: true,
        },
        fecha_pago: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        monto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        metodo_pago: {
            type: DataTypes.STRING(50),
        },
        estado_pago: {
            type: DataTypes.ENUM('pendiente', 'completado', 'fallido', 'reembolsado'),
            defaultValue: 'pendiente',
        },
        referencia_transaccion: {
            type: DataTypes.STRING(100),
        }
    }, {
        tableName: 'Pagos',
        timestamps: false,
    });

    return Payment;
};

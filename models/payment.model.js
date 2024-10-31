// models/payment.model.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Payment', {
        pago_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orden_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        codigo_pago: {
            type: DataTypes.STRING(50),
            unique: true
        },
        fecha_pago: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        monto: DataTypes.DECIMAL(10, 2),
        metodo_pago: DataTypes.STRING(50),
        estado_pago: {
            type: DataTypes.ENUM('pendiente', 'completado', 'fallido', 'reembolsado'),
            defaultValue: 'pendiente'
        },
        referencia_transaccion: DataTypes.STRING(100)
    }, {
        tableName: 'Pagos',
        timestamps: false
    });
};


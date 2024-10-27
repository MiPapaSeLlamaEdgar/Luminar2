// models/order.model.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Order', {
        orden_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        codigo_orden: {
            type: DataTypes.STRING(20),
            unique: true
        },
        fecha_orden: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        fecha_entrega_estimada: DataTypes.DATE,
        fecha_entrega_real: DataTypes.DATE,
        subtotal: DataTypes.DECIMAL(10, 2),
        impuestos: DataTypes.DECIMAL(10, 2),
        descuento: DataTypes.DECIMAL(10, 2),
        total: DataTypes.DECIMAL(10, 2),
        estado: {
            type: DataTypes.ENUM('pendiente', 'confirmada', 'en proceso', 'enviada', 'entregada', 'cancelada'),
            defaultValue: 'pendiente'
        },
        direccion_envio: DataTypes.TEXT,
        notas: DataTypes.TEXT
    }, {
        tableName: 'Ordenes',
        timestamps: false
    });
};


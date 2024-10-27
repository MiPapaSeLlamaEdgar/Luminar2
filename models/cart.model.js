// models/cart.model.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Cart', {
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
};
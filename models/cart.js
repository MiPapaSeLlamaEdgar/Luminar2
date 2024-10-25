const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Cart = sequelize.define('Carrito', {
        carrito_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Clientes', // Referring to the Clientes table
                key: 'cliente_id',
            },
        },
        producto_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Productos', // Referring to the Productos table
                key: 'producto_id',
            },
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1, // Default quantity set to 1
        },
    }, {
        tableName: 'Carrito',
        timestamps: false, // Assuming you don't need timestamps for this table
    });

    return Cart;
};
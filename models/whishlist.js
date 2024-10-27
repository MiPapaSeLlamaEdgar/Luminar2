const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Whishlist = sequelize.define('ListaDeseos', {
        wishlist_id: {
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
        producto_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Productos',
                key: 'producto_id',
            },
        },
        fecha_agregado: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        notificar_disponibilidad: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        tableName: 'Lista_Deseos',
        timestamps: false,
        indexes: [{
            unique: true,
            fields: ['cliente_id', 'producto_id']
        }]
    });

    return Whishlist;
};

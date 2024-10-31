// models/wishlist.model.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Wishlist', {
        wishlist_id: {
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
        fecha_agregado: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        notificar_disponibilidad: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'Lista_Deseos',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['cliente_id', 'producto_id']
            }
        ]
    });
};


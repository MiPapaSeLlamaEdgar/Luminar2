// models/wishlist.model.js
module.exports = (sequelize, DataTypes) => {
    const Wishlist = sequelize.define('Wishlist', {
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

    // Asociaciones con Client y Product
    Wishlist.associate = models => {
        Wishlist.belongsTo(models.Client, { foreignKey: 'cliente_id', as: 'Cliente' });
        Wishlist.belongsTo(models.Product, { foreignKey: 'producto_id', as: 'Producto' });
    };

    return Wishlist;
};

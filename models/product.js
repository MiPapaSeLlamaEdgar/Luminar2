const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Product = sequelize.define('Producto', {
        producto_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre_producto: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
        },
        talla: {
            type: DataTypes.STRING(10),
        },
        color: {
            type: DataTypes.STRING(50),
        },
        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        cantidad_stock: {
            type: DataTypes.INTEGER,
        },
        categoria_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Categorias',
                key: 'categoria_id',
            },
        },
        imagenes: {
            type: DataTypes.JSON,
        },
        especificaciones: {
            type: DataTypes.JSON,
        },
        estado: {
            type: DataTypes.ENUM('activo', 'inactivo', 'agotado'),
            defaultValue: 'activo',
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        fecha_modificacion: {
            type: DataTypes.DATE,
        }
    }, {
        tableName: 'Productos',
        timestamps: false,
    });

    return Product;
};

// models/product.model.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Product', {
        producto_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_producto: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        descripcion: DataTypes.TEXT,
        talla: DataTypes.STRING(10),
        color: DataTypes.STRING(50),
        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        cantidad_stock: DataTypes.INTEGER,
        categoria_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imagenes: DataTypes.JSON,
        especificaciones: DataTypes.JSON,
        estado: {
            type: DataTypes.ENUM('activo', 'inactivo', 'agotado'),
            defaultValue: 'activo'
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        fecha_modificacion: DataTypes.DATE
    }, {
        tableName: 'Productos',
        timestamps: false
    });
};


// models/category.model.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Category', {
        categoria_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_categoria: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        categoria_padre_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        descripcion: DataTypes.TEXT,
        imagen: DataTypes.STRING(255),
        estado: {
            type: DataTypes.ENUM('activo', 'inactivo'),
            defaultValue: 'activo'
        }
    }, {
        tableName: 'Categorias',
        timestamps: false
    });
};


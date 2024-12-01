// models/role.model.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Role', {
        rol_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_rol: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        permisos: {
            type: DataTypes.JSON,
            allowNull: true
        }
    }, {
        tableName: 'Roles',
        timestamps: false
    });
};


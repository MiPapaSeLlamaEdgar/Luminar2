module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Role', {
        rol_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre_rol: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        descripcion: DataTypes.TEXT,
        permisos: DataTypes.JSON
    }, {
        tableName: 'Roles',
        timestamps: false,
    });
};
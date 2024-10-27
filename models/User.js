module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Usuario', {
        usuario_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        apellido: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        correo_electronico: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false,
        },
        contrasena: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        rol_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        estado: {
            type: DataTypes.ENUM('activo', 'inactivo', 'suspendido'),
            defaultValue: 'activo',
        },
        ultimo_acceso: {
            type: DataTypes.DATE,
        }
    }, {
        tableName: 'Usuarios',
        timestamps: false,
    });
};
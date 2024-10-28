module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        usuario_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        correo_electronico: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: {
                name: 'idx_correo_electronico',
                msg: 'Este correo electrónico ya está registrado'
            },
            validate: {
                isEmail: {
                    msg: 'Por favor, introduce un correo electrónico válido'
                }
            }
        },
        contrasena: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        rol_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_registro: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        ultimo_acceso: {
            type: DataTypes.DATE,
            allowNull: true
        },
        estado: {
            type: DataTypes.ENUM('activo', 'inactivo', 'suspendido'),
            defaultValue: 'activo'
        },
        imagen_perfil: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: 'Usuarios',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['correo_electronico'],
                name: 'idx_correo_electronico'
            }
        ]
    });
};
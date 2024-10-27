module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Cliente', {
        cliente_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Usuarios',
                key: 'usuario_id'
            }
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
            allowNull: false,
            unique: true,
        },
        telefono: DataTypes.STRING(15),
        direccion: DataTypes.TEXT
    }, {
        tableName: 'Clientes',
        timestamps: false,
    });
};
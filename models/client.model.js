// models/client.model.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Client', {
        cliente_id: {
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
            unique: true
        },
        telefono: {
            type: DataTypes.STRING(15)
        },
        direccion: DataTypes.TEXT,
        ciudad: DataTypes.STRING(100),
        codigo_postal: DataTypes.STRING(10),
        fecha_registro: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        fecha_nacimiento: DataTypes.DATE,
        genero: {
            type: DataTypes.ENUM('M', 'F', 'Otro')
        },
        preferencias: DataTypes.JSON,
        ultima_compra: DataTypes.DATE
    }, {
        tableName: 'Clientes',
        timestamps: false
    });
};


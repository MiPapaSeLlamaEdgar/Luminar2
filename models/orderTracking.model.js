// models/orderTracking.model.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('OrderTracking', {
        seguimiento_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orden_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        fecha_actualizacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'Seguimiento_Ordenes', // Nombre de la tabla en la base de datos
        timestamps: false
    });
};

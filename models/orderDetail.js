const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const orderTracking = sequelize.define('SeguimientoOrden', {
        seguimiento_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        orden_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Ordenes',
                key: 'orden_id',
            },
        },
        estado: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
        },
        fecha_actualizacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Usuarios',
                key: 'usuario_id',
            },
        }
    }, {
        tableName: 'Seguimiento_Ordenes',
        timestamps: false,
    });

    return orderTracking;
};

// models/orderDetail.model.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('OrderDetail', {
        seguimiento_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orden_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        estado: DataTypes.STRING(50),
        descripcion: DataTypes.TEXT,
        fecha_actualizacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'Seguimiento_Ordenes',
        timestamps: false
    });
};


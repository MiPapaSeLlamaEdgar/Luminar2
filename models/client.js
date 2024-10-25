const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   const Client = sequelize.define('Cliente', {
       cliente_id: {
           type: DataTypes.INTEGER,
           primaryKey: true,
           autoIncrement: true,
       },
       nombre: {
           type: DataTypes.STRING,
           allowNull: false,
       },
       apellido: {
           type: DataTypes.STRING,
           allowNull: false,
       },
       correo_electronico: {
           type: DataTypes.STRING,
           unique: true,
           allowNull: false,
       },
       telefono: {
           type: DataTypes.STRING(15),
           allowNull: true, // Optional field
       },
       direccion: {
           type: DataTypes.STRING(255),
           allowNull: true, // Optional field
       },
       fecha_registro: {
           type: DataTypes.DATEONLY,
           allowNull: false,
           defaultValue: DataTypes.NOW, // Set current date as default
       },
   }, {
       tableName: 'Clientes',
       timestamps: false,
   });

   return Client;
};
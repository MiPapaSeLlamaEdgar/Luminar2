const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   const User = sequelize.define('Usuario', {
       usuario_id: {
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
       contrasena: {
           type: DataTypes.STRING,
           allowNull: false,
       },
       rol_id: {
           type: DataTypes.INTEGER,
           allowNull: false,
           defaultValue: 1, // Default role ID
       },
       fecha_registro: {
           type: DataTypes.DATEONLY,
           allowNull: false,
           defaultValue: DataTypes.NOW, // Set current date as default
       },
   }, {
       tableName: 'Usuarios',
       timestamps: false,
   });

   return User;
};
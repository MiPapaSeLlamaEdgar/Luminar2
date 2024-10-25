const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   const Role = sequelize.define('Rol', {
       rol_id: {
           type: DataTypes.INTEGER,
           primaryKey: true,
           autoIncrement: true,
       },
       nombre_rol: {
           type: DataTypes.STRING,
           allowNull: false,
       },
   }, {
       tableName: 'Roles',
       timestamps: false,
   });

   return Role;
};
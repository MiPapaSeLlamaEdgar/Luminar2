const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   const Order = sequelize.define('Orden', {
      orden_id:{
          type :DataTypes.INTEGER ,
          primaryKey:true ,
          autoIncrement:true 
      }, 
      cliente_id:{
          type :DataTypes.INTEGER ,
          references:{
              model:'Clientes',
              key:'cliente_id'
          }
      }, 
      usuario_id:{
          type :DataTypes.INTEGER ,
          references:{
              model:'Usuarios',
              key:'usuario_id'
          }
      }, 
      fecha_orden:{
          type :DataTypes.DATEONLY ,
          defaultValue :DataTypes.NOW 
      }, 
      total:{
          type :DataTypes.DECIMAL(10 ,2) ,
          allowNull:false 
      }
   }, { 
      tableName:'Ordenes',
      timestamps:false 
   });

   return Order;
};
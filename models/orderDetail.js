const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   const OrderDetail = sequelize.define('Detalle_Orden', {
      detalle_id:{
          type :DataTypes.INTEGER ,
          primaryKey:true ,
          autoIncrement:true 
      }, 
      orden_id:{
          type :DataTypes.INTEGER ,
          references:{
              model:'Ordenes',
              key:'orden_id'
          }
      }, 
      producto_id:{
          type :DataTypes.INTEGER ,
          references:{
              model:'Productos',
              key:'producto_id'
          }
      }, 
      cantidad:{
          type :DataTypes.INTEGER ,
          allowNull:false 
      }, 
      precio_unitario:{
          type :DataTypes.DECIMAL(10 ,2) ,
          allowNull:false 
      }
   }, { 
      tableName:'Detalle_Ordenes',
      timestamps:false 
   });

   return OrderDetail;
};
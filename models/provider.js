const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   const Provider = sequelize.define('Proveedor', {
      proveedor_id:{
          type :DataTypes.INTEGER ,
          primaryKey:true ,
          autoIncrement:true 
      }, 
      nombre_proveedor:{
          type :DataTypes.STRING ,
          allowNull:false 
      }, 
      contacto_proveedor:{
          type :DataTypes.STRING ,
          allowNull:false 
      }, 
      telefono:{
          type :DataTypes.STRING(15) ,
          allowNull:true // Optional field
      }, 
      correo_electronico:{
          type :DataTypes.STRING ,
          unique:true , // Unique constraint
          allowNull:true // Optional field
      }, 
      direccion:{
          type :DataTypes.STRING(255) ,
          allowNull:true // Optional field
      }
   }, { 
     tableName:'Proveedores',
     timestamps:false  
   });

   return Provider;
};
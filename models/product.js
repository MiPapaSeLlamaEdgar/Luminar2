const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   const Product = sequelize.define('Producto', {
       producto_id: {
           type: DataTypes.INTEGER,
           primaryKey: true,
           autoIncrement: true,
       },
       nombre_producto: {
           type: DataTypes.STRING,
           allowNull: false,
       },
       descripcion: {
           type: DataTypes.TEXT,
           allowNull: true, // Optional field
       },
       talla: {
           type: DataTypes.STRING(10),
           allowNull: true, // Optional field
       },
       color: {
           type: DataTypes.STRING(50),
           allowNull: true, // Optional field
       },
       precio: {
           type: DataTypes.DECIMAL(10, 2),
           allowNull:false
        },
        cantidad_stock:{
            type :DataTypes.INTEGER ,
            allowNull :false 
        }, 
        categoria_id:{
            type :DataTypes.INTEGER ,
            references:{
                model:'Categorias',
                key:'categoria_id'
            }
        }
   }, {
      tableName:'Productos',
      timestamps:false
   });

   return Product;
};
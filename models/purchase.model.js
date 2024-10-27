const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Purchase = sequelize.define('Compra', {
        compra_id:{
            type :DataTypes.INTEGER ,
            primaryKey:true ,
            autoIncrement:true  
        },  
        proveedor_id:{
            type :DataTypes.INTEGER ,  
            references:{  
                model:'Proveedores',  
                key:'proveedor_id'  
            }  
        },  
        usuario_id:{  
            type :DataTypes.INTEGER ,  
            references:{  
                model:'Usuarios',  
                key:'usuario_id'  
            }  
        },  
        fecha_compra:{  
            type :DataTypes.DATEONLY ,  
            defaultValue :DataTypes.NOW   
        },  
        total_compra:{  
            type :DataTypes.DECIMAL(10 ,2) ,  
            allowNull:false   
        }  
    }, {  
        tableName:'Compras',  
        timestamps:false   
    });  

    return Purchase;    
};
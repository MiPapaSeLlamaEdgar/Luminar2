const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Payment = sequelize.define('Pago', {
        pago_id:{
            type :DataTypes.INTEGER ,    
            primaryKey:true ,    
            autoIncrement:true    
        },    
        orden_id:{    
            type :DataTypes.INTEGER ,    
            references:{    
                model:'Ordenes' ,    
                key:'orden_id'    
            }    
        },    
        fecha_pago:{    
            type :DataTypes.DATEONLY ,    
            defaultValue :DataTypes.NOW     
        },    
        monto:{    
            type :DataTypes.DECIMAL(10 ,2) ,     
            allowNull:false     
        },    
        metodo_pago:{     
             type :DataTypes.STRING(50) ,     
             allowNull:false     
         }     
    }, {     
         tableName:'Pagos',     
         timestamps:false     
     });     

     return Payment;     
};
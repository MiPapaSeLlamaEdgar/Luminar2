const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PurchaseDetail = sequelize.define('Detalle_Compra', {
        detalle_compra_id:{
            type :DataTypes.INTEGER ,   
            primaryKey:true ,   
            autoIncrement:true   
        },   
        compra_id:{   
            type :DataTypes.INTEGER ,   
            references:{   
                model:'Compras',   
                key:'compra_id'   
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
        precio_compra:{    
            type :DataTypes.DECIMAL(10 ,2) ,    
            allowNull:false    
        }    
    }, {    
        tableName:'Detalle_Compras',    
        timestamps:false    
    });    

    return PurchaseDetail;    
};
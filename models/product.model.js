module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        producto_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_producto: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El nombre del producto no puede estar vacío'
                }
            }
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        talla: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        color: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isDecimal: {
                    msg: 'El precio debe ser un valor decimal válido'
                },
                min: {
                    args: [0],
                    msg: 'El precio no puede ser negativo'
                }
            }
        },
        cantidad_stock: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'La cantidad en stock debe ser un número entero válido'
                },
                min: {
                    args: [0],
                    msg: 'La cantidad en stock no puede ser negativa'
                }
            }
        },
        categoria_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La categoría del producto es obligatoria'
                }
            }
        },
        imagenes: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        especificaciones: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        estado: {
            type: DataTypes.ENUM('activo', 'inactivo', 'agotado'),
            defaultValue: 'activo'
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        fecha_modificacion: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'Productos',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['nombre_producto', 'categoria_id'],
                name: 'idx_nombre_producto_categoria'
            }
        ]
    });

    // Relación con Cart (opcional)
    Product.associate = models => {
        Product.hasMany(models.Cart, {
            foreignKey: 'producto_id',
            as: 'Carts'
        });
    };  

    // Relación con Categoria (opcional)
    Product.associate = (models) => {
        Product.belongsTo(models.Category, { foreignKey: 'categoria_id', as: 'Categoria' });
    };

    return Product;
};

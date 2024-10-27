const { DataTypes } = require('sequelize');

function initModels(sequelize) {
    const Usuario = require('./user')(sequelize, DataTypes);
    const Cliente = require('./client')(sequelize, DataTypes);
    const Role = require('./role')(sequelize, DataTypes);

    // Definir relaciones
    Usuario.belongsTo(Role, { foreignKey: 'rol_id' });
    Usuario.hasOne(Cliente, { foreignKey: 'usuario_id' });
    Cliente.belongsTo(Usuario, { foreignKey: 'usuario_id' });

    return {
        Usuario,
        Cliente,
        Role
    };
}

module.exports = initModels;
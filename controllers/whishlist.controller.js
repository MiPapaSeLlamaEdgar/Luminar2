const express = require('express');
const router = express.Router();

module.exports = (sequelize) => {
    const Wishlist = sequelize.models.Lista_Deseos;
    const Producto = sequelize.models.Producto;

    // Agregar a la lista de deseos
    router.post('/add', async (req, res) => {
        try {
            const { producto_id } = req.body;
            const cliente_id = req.session.cliente_id;

            const [item, created] = await Wishlist.findOrCreate({
                where: { cliente_id, producto_id }
            });

            if (created) {
                res.json({ message: 'Producto agregado a la lista de deseos' });
            } else {
                await item.destroy();
                res.json({ message: 'Producto eliminado de la lista de deseos' });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error del servidor' });
        }
    });

    // Obtener items de la lista de deseos
    router.get('/items', async (req, res) => {
        try {
            const cliente_id = req.session.cliente_id;
            
            const items = await Wishlist.findAll({
                where: { cliente_id },
                include: [{
                    model: Producto,
                    attributes: ['nombre_producto', 'precio', 'imagen_url']
                }]
            });

            res.json(items);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error al obtener la lista de deseos' });
        }
    });

    // Obtener contador
    router.get('/count', async (req, res) => {
        try {
            const cliente_id = req.session.cliente_id;
            
            const count = await Wishlist.count({
                where: { cliente_id }
            });

            res.json({ count });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error al obtener el conteo' });
        }
    });

    return router;
};
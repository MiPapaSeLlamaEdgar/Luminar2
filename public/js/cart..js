// controllers/cart.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/db.js');

module.exports = (sequelize) => {
    const Cart = sequelize.models.Carrito;
    const Product = sequelize.models.Producto;

    // Agregar al carrito
    router.post('/add', async (req, res) => {
        try {
            const { producto_id, cantidad } = req.body;
            const cliente_id = req.session.cliente_id;

            const [existingItem] = await Cart.findOrCreate({
                where: { cliente_id, producto_id },
                defaults: { cantidad }
            });

            if (!existingItem.isNewRecord) {
                await existingItem.update({
                    cantidad: existingItem.cantidad + cantidad
                });
            }

            res.json({ message: 'Producto agregado al carrito' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error al agregar al carrito' });
        }
    });

    // Obtener carrito
    router.get('/items', async (req, res) => {
        try {
            const cliente_id = req.session.cliente_id;
            
            const items = await Cart.findAll({
                where: { cliente_id },
                include: [Product]
            });

            res.json(items);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error al obtener el carrito' });
        }
    });

    return router;
};
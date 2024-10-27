// routes/cart.routes.js
const express = require('express');
const router = express.Router();

module.exports = (models) => {
    const { Cart } = models;

    // Obtener todos los items del carrito
    router.get('/', async (req, res) => {
        try {
            const cartItems = await Cart.findAll({
                include: ['Cliente', 'Producto']
            });
            res.json(cartItems);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener items del carrito',
                error: error.message
            });
        }
    });

    // Obtener items del carrito por cliente
    router.get('/cliente/:clienteId', async (req, res) => {
        try {
            const cartItems = await Cart.findAll({
                where: { cliente_id: req.params.clienteId },
                include: ['Producto']
            });
            res.json(cartItems);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener items del carrito',
                error: error.message
            });
        }
    });

    // Agregar item al carrito
    router.post('/', async (req, res) => {
        try {
            const cartItem = await Cart.create(req.body);
            res.status(201).json(cartItem);
        } catch (error) {
            res.status(500).json({
                message: 'Error al agregar item al carrito',
                error: error.message
            });
        }
    });

    // Actualizar cantidad de item
    router.put('/:id', async (req, res) => {
        try {
            const cartItem = await Cart.findByPk(req.params.id);
            if (!cartItem) {
                return res.status(404).json({ message: 'Item no encontrado' });
            }
            await cartItem.update(req.body);
            res.json(cartItem);
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar item del carrito',
                error: error.message
            });
        }
    });

    // Eliminar item del carrito
    router.delete('/:id', async (req, res) => {
        try {
            const cartItem = await Cart.findByPk(req.params.id);
            if (!cartItem) {
                return res.status(404).json({ message: 'Item no encontrado' });
            }
            await cartItem.destroy();
            res.json({ message: 'Item eliminado del carrito' });
        } catch (error) {
            res.status(500).json({
                message: 'Error al eliminar item del carrito',
                error: error.message
            });
        }
    });

    return router;
};


// routes/whishlist.routes.js
const express = require('express');
const router = express.Router();

module.exports = (models) => {
    const { Whishlist } = models;

    // Obtener lista de deseos
    router.get('/', async (req, res) => {
        try {
            const wishlistItems = await Whishlist.findAll({
                include: ['Cliente', 'Producto']
            });
            res.json(wishlistItems);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener lista de deseos',
                error: error.message
            });
        }
    });

    // Obtener lista de deseos por cliente
    router.get('/cliente/:clienteId', async (req, res) => {
        try {
            const wishlistItems = await Whishlist.findAll({
                where: { cliente_id: req.params.clienteId },
                include: ['Producto']
            });
            res.json(wishlistItems);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener lista de deseos',
                error: error.message
            });
        }
    });

    // Agregar item a lista de deseos
    router.post('/', async (req, res) => {
        try {
            const wishlistItem = await Whishlist.create(req.body);
            res.status(201).json(wishlistItem);
        } catch (error) {
            res.status(500).json({
                message: 'Error al agregar item a lista de deseos',
                error: error.message
            });
        }
    });

    // Eliminar item de lista de deseos
    router.delete('/:id', async (req, res) => {
        try {
            const wishlistItem = await Whishlist.findByPk(req.params.id);
            if (!wishlistItem) {
                return res.status(404).json({ message: 'Item no encontrado' });
            }
            await wishlistItem.destroy();
            res.json({ message: 'Item eliminado de la lista de deseos' });
        } catch (error) {
            res.status(500).json({
                message: 'Error al eliminar item de la lista de deseos',
                error: error.message
            });
        }
    });

    return router;
};


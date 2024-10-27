// routes/order.routes.js
const express = require('express');
const router = express.Router();

module.exports = (models) => {
    const { Order } = models;

    // Obtener todas las órdenes
    router.get('/', async (req, res) => {
        try {
            const orders = await Order.findAll({
                include: ['Cliente', 'Usuario']
            });
            res.json(orders);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener órdenes',
                error: error.message
            });
        }
    });

    // Obtener una orden específica
    router.get('/:id', async (req, res) => {
        try {
            const order = await Order.findByPk(req.params.id, {
                include: ['Cliente', 'Usuario', 'OrderDetails']
            });
            if (!order) {
                return res.status(404).json({ message: 'Orden no encontrada' });
            }
            res.json(order);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener orden',
                error: error.message
            });
        }
    });

    // Crear nueva orden
    router.post('/', async (req, res) => {
        try {
            const order = await Order.create(req.body);
            res.status(201).json(order);
        } catch (error) {
            res.status(500).json({
                message: 'Error al crear orden',
                error: error.message
            });
        }
    });

    // Actualizar orden
    router.put('/:id', async (req, res) => {
        try {
            const order = await Order.findByPk(req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Orden no encontrada' });
            }
            await order.update(req.body);
            res.json(order);
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar orden',
                error: error.message
            });
        }
    });

    // Eliminar orden
    router.delete('/:id', async (req, res) => {
        try {
            const order = await Order.findByPk(req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Orden no encontrada' });
            }
            await order.destroy();
            res.json({ message: 'Orden eliminada correctamente' });
        } catch (error) {
            res.status(500).json({
                message: 'Error al eliminar orden',
                error: error.message
            });
        }
    });

    return router;
};


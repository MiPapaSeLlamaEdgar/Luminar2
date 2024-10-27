// routes/orderDetail.routes.js
const express = require('express');
const router = express.Router();

module.exports = (models) => {
    const { OrderDetail } = models;

    // Obtener todos los detalles de órdenes
    router.get('/', async (req, res) => {
        try {
            const orderDetails = await OrderDetail.findAll({
                include: ['Order']
            });
            res.json(orderDetails);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener detalles de órdenes',
                error: error.message
            });
        }
    });

    // Obtener detalles de una orden específica
    router.get('/orden/:ordenId', async (req, res) => {
        try {
            const orderDetails = await OrderDetail.findAll({
                where: { orden_id: req.params.ordenId },
                include: ['Order']
            });
            res.json(orderDetails);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener detalles de la orden',
                error: error.message
            });
        }
    });

    // Obtener un detalle específico
    router.get('/:id', async (req, res) => {
        try {
            const orderDetail = await OrderDetail.findByPk(req.params.id, {
                include: ['Order']
            });
            if (!orderDetail) {
                return res.status(404).json({ message: 'Detalle de orden no encontrado' });
            }
            res.json(orderDetail);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener detalle de orden',
                error: error.message
            });
        }
    });

    // Crear nuevo detalle de orden
    router.post('/', async (req, res) => {
        try {
            const orderDetail = await OrderDetail.create(req.body);
            res.status(201).json(orderDetail);
        } catch (error) {
            res.status(500).json({
                message: 'Error al crear detalle de orden',
                error: error.message
            });
        }
    });

    // Actualizar detalle de orden
    router.put('/:id', async (req, res) => {
        try {
            const orderDetail = await OrderDetail.findByPk(req.params.id);
            if (!orderDetail) {
                return res.status(404).json({ message: 'Detalle de orden no encontrado' });
            }
            await orderDetail.update(req.body);
            res.json(orderDetail);
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar detalle de orden',
                error: error.message
            });
        }
    });

    // Eliminar detalle de orden
    router.delete('/:id', async (req, res) => {
        try {
            const orderDetail = await OrderDetail.findByPk(req.params.id);
            if (!orderDetail) {
                return res.status(404).json({ message: 'Detalle de orden no encontrado' });
            }
            await orderDetail.destroy();
            res.json({ message: 'Detalle de orden eliminado correctamente' });
        } catch (error) {
            res.status(500).json({
                message: 'Error al eliminar detalle de orden',
                error: error.message
            });
        }
    });

    return router;
};
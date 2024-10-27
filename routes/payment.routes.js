// routes/payment.routes.js
const express = require('express');
const router = express.Router();

module.exports = (models) => {
    const { Payment } = models;

    // Obtener todos los pagos
    router.get('/', async (req, res) => {
        try {
            const payments = await Payment.findAll({
                include: ['Orden']
            });
            res.json(payments);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener pagos',
                error: error.message
            });
        }
    });

    // Obtener un pago específico
    router.get('/:id', async (req, res) => {
        try {
            const payment = await Payment.findByPk(req.params.id, {
                include: ['Orden']
            });
            if (!payment) {
                return res.status(404).json({ message: 'Pago no encontrado' });
            }
            res.json(payment);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener pago',
                error: error.message
            });
        }
    });

    // Crear nuevo pago
    router.post('/', async (req, res) => {
        try {
            const payment = await Payment.create(req.body);
            res.status(201).json(payment);
        } catch (error) {
            res.status(500).json({
                message: 'Error al crear pago',
                error: error.message
            });
        }
    });

    // Actualizar pago
    router.put('/:id', async (req, res) => {
        try {
            const payment = await Payment.findByPk(req.params.id);
            if (!payment) {
                return res.status(404).json({ message: 'Pago no encontrado' });
            }
            await payment.update(req.body);
            res.json(payment);
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar pago',
                error: error.message
            });
        }
    });

    return router;
};


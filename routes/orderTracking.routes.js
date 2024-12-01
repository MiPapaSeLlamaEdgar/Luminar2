const express = require('express');
const router = express.Router();

module.exports = (models) => {
    const { OrderTracking, Order, User } = models;

    // Obtener todos los seguimientos de órdenes
    router.get('/', async (req, res) => {
        try {
            const trackingRecords = await OrderTracking.findAll({
                include: [
                    {
                        model: Order,
                        as: 'Orden',
                        attributes: ['codigo_orden', 'fecha_orden', 'estado']
                    },
                    {
                        model: User,
                        as: 'Usuario',
                        attributes: ['nombre', 'apellido', 'correo_electronico']
                    }
                ]
            });
            res.json(trackingRecords);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los seguimientos de órdenes', error: error.message });
        }
    });

    // Obtener un seguimiento de orden específico
    router.get('/:id', async (req, res) => {
        try {
            const trackingRecord = await OrderTracking.findByPk(req.params.id, {
                include: [
                    {
                        model: Order,
                        as: 'Orden',
                        attributes: ['codigo_orden', 'fecha_orden', 'estado']
                    },
                    {
                        model: User,
                        as: 'Usuario',
                        attributes: ['nombre', 'apellido', 'correo_electronico']
                    }
                ]
            });

            if (!trackingRecord) {
                return res.status(404).json({ message: 'Seguimiento de orden no encontrado' });
            }

            res.json(trackingRecord);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el seguimiento de orden', error: error.message });
        }
    });

    // Crear un nuevo seguimiento de orden
    router.post('/', async (req, res) => {
        try {
            const newTrackingRecord = await OrderTracking.create(req.body);
            res.status(201).json(newTrackingRecord);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear seguimiento de orden', error: error.message });
        }
    });

    // Actualizar un seguimiento de orden
    router.put('/:id', async (req, res) => {
        try {
            const trackingRecord = await OrderTracking.findByPk(req.params.id);

            if (!trackingRecord) {
                return res.status(404).json({ message: 'Seguimiento de orden no encontrado' });
            }

            await trackingRecord.update(req.body);
            res.json(trackingRecord);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar seguimiento de orden', error: error.message });
        }
    });

    // Eliminar un seguimiento de orden
    router.delete('/:id', async (req, res) => {
        try {
            const trackingRecord = await OrderTracking.findByPk(req.params.id);

            if (!trackingRecord) {
                return res.status(404).json({ message: 'Seguimiento de orden no encontrado' });
            }

            await trackingRecord.destroy();
            res.json({ message: 'Seguimiento de orden eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar seguimiento de orden', error: error.message });
        }
    });

    return router;
};

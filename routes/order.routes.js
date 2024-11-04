// routes/order.routes.js
const express = require('express');
const router = express.Router();

module.exports = (models) => {
    const { Order, OrderDetail, Client, User, Product } = models;

    // Obtener todas las órdenes
    router.get('/', async (req, res) => {
        try {
            const orders = await Order.findAll({
                include: [
                    { model: Client, attributes: ['nombre', 'apellido'] },
                    { model: User, as: 'Usuario', attributes: ['nombre', 'apellido'] },
                    { 
                        model: OrderDetail,
                        attributes: ['producto_id', 'cantidad'],
                        include: [{ model: Product, attributes: ['nombre_producto', 'precio'] }]
                    }
                ]
            });
            res.json(orders);
        } catch (error) {
            console.error('Error al obtener órdenes:', error);
            res.status(500).json({ message: 'Error al obtener órdenes', error: error.message });
        }
    });

    // Obtener una orden específica
    router.get('/:id', async (req, res) => {
        try {
            const order = await Order.findByPk(req.params.id, {
                include: [
                    { model: Client, attributes: ['nombre', 'apellido', 'correo_electronico'] },
                    { model: User, as: 'Usuario', attributes: ['nombre', 'apellido', 'correo_electronico'] },
                    {
                        model: OrderDetail,
                        include: [{ model: Product, attributes: ['nombre_producto', 'precio'] }]
                    }
                ]
            });
            if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
            res.json(order);
        } catch (error) {
            console.error('Error al obtener orden:', error);
            res.status(500).json({ message: 'Error al obtener orden', error: error.message });
        }
    });

    // Crear nueva orden
    router.post('/', async (req, res) => {
        try {
            const { detalles, ...orderData } = req.body;

            // Crear la nueva orden
            const newOrder = await Order.create(orderData);

            // Agregar los detalles de la orden
            if (detalles && detalles.length > 0) {
                for (const detalle of detalles) {
                    await OrderDetail.create({
                        ...detalle,
                        orden_id: newOrder.orden_id
                    });
                }
            }

            res.status(201).json(newOrder);
        } catch (error) {
            console.error('Error al crear orden:', error);
            res.status(500).json({ message: 'Error al crear orden', error: error.message });
        }
    });

    // Actualizar orden
    router.put('/:id', async (req, res) => {
        try {
            const { detalles, ...orderData } = req.body;

            const order = await Order.findByPk(req.params.id);
            if (!order) return res.status(404).json({ message: 'Orden no encontrada' });

            // Actualizar los datos de la orden
            await order.update(orderData);

            // Actualizar detalles de la orden si se proporcionan
            if (detalles && detalles.length > 0) {
                await OrderDetail.destroy({ where: { orden_id: order.orden_id } }); // Eliminar detalles anteriores
                for (const detalle of detalles) {
                    await OrderDetail.create({
                        ...detalle,
                        orden_id: order.orden_id
                    });
                }
            }

            res.json(order);
        } catch (error) {
            console.error('Error al actualizar orden:', error);
            res.status(500).json({ message: 'Error al actualizar orden', error: error.message });
        }
    });

    // Eliminar orden
    router.delete('/:id', async (req, res) => {
        try {
            const order = await Order.findByPk(req.params.id);
            if (!order) return res.status(404).json({ message: 'Orden no encontrada' });

            await order.destroy();
            res.json({ message: 'Orden eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar orden:', error);
            res.status(500).json({ message: 'Error al eliminar orden', error: error.message });
        }
    });

    return router;
};

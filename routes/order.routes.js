// routes/order.routes.js
const express = require('express');
const router = express.Router();

module.exports = (models) => {
    const { Order, OrderDetail, Client, User, Product, Cart } = models;

    // Obtener todas las órdenes
    router.get('/', async (req, res) => {
        try {
            const orders = await Order.findAll({
                include: [
                    { model: Client, attributes: ['nombre', 'apellido'] },
                    { model: User, as: 'Usuario', attributes: ['nombre', 'apellido'] },
                    { 
                        model: OrderDetail,
                        as: 'Detalles',  // Ensure that this alias matches the alias defined in the association
                        attributes: ['producto_id', 'cantidad'],
                        include: [{ model: Product, as: 'Producto', attributes: ['nombre_producto', 'precio'] }]
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
                        as: 'Detalles', // Ensure this alias matches the alias in the association
                        include: [{ model: Product, as: 'Producto', attributes: ['nombre_producto', 'precio'] }]
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
        const transaction = await models.sequelize.transaction();
        try {
            const { detalles, ...orderData } = req.body;

            // Crear la nueva orden
            const newOrder = await Order.create(orderData, { transaction });

            // Agregar los detalles de la orden
            if (detalles && detalles.length > 0) {
                const detallesData = detalles.map(detalle => ({
                    ...detalle,
                    orden_id: newOrder.orden_id
                }));
                await OrderDetail.bulkCreate(detallesData, { transaction }); // Bulk create for efficiency
            }

            await transaction.commit();
            res.status(201).json(newOrder);
        } catch (error) {
            await transaction.rollback();
            console.error('Error al crear orden:', error);
            res.status(500).json({ message: 'Error al crear orden', error: error.message });
        }
    });

    // Actualizar orden
    router.put('/:id', async (req, res) => {
        const transaction = await models.sequelize.transaction();
        try {
            const { detalles, ...orderData } = req.body;

            const order = await Order.findByPk(req.params.id);
            if (!order) return res.status(404).json({ message: 'Orden no encontrada' });

            // Actualizar los datos de la orden
            await order.update(orderData, { transaction });

            // Actualizar detalles de la orden si se proporcionan
            if (detalles && detalles.length > 0) {
                await OrderDetail.destroy({ where: { orden_id: order.orden_id }, transaction }); // Eliminar detalles anteriores
                const detallesData = detalles.map(detalle => ({
                    ...detalle,
                    orden_id: order.orden_id
                }));
                await OrderDetail.bulkCreate(detallesData, { transaction }); // Bulk create new details
            }

            await transaction.commit();
            res.json(order);
        } catch (error) {
            await transaction.rollback();
            console.error('Error al actualizar orden:', error);
            res.status(500).json({ message: 'Error al actualizar orden', error: error.message });
        }
    });

    // Eliminar orden
    router.delete('/:id', async (req, res) => {
        const transaction = await models.sequelize.transaction();
        try {
            const order = await Order.findByPk(req.params.id);
            if (!order) return res.status(404).json({ message: 'Orden no encontrada' });

            await order.destroy({ transaction });
            await transaction.commit();
            res.json({ message: 'Orden eliminada correctamente' });
        } catch (error) {
            await transaction.rollback();
            console.error('Error al eliminar orden:', error);
            res.status(500).json({ message: 'Error al eliminar orden', error: error.message });
        }
    });

    // Obtener conteo total de items en el carrito por cliente
    router.get('/cart/count', async (req, res) => {
        try {
            const clienteId = req.query.clienteId; // Assume clienteId is passed as a query parameter

            if (!clienteId) {
                return res.status(400).json({ message: 'Cliente ID es requerido' });
            }

            // Sumar la columna `cantidad` para obtener el total de items en el carrito del cliente
            const cartCount = await Cart.sum('cantidad', {
                where: { cliente_id: clienteId }
            });

            res.json({ count: cartCount || 0 }); // Return 0 if no items found
        } catch (error) {
            console.error('Error al obtener conteo de items del carrito:', error);
            res.status(500).json({
                message: 'Error al obtener conteo de items del carrito',
                error: error.message
            });
        }
    });
    
    return router;
};

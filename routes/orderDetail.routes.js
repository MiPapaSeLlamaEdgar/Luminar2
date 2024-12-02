    // routes/orderDetail.routes.js
    const express = require('express');
    const router = express.Router();

    module.exports = (models) => {
        const { OrderDetail, Order, Product } = models;

        // Obtener todos los detalles de órdenes
        router.get('/', async (req, res) => {
            try {
                const orderDetails = await OrderDetail.findAll({
                    include: [
                        {
                            model: Order,
                            as: 'Orden', // Ensure this alias matches the defined alias in the model associations
                            attributes: ['orden_id', 'fecha_orden', 'estado']
                        },
                        {
                            model: Product,
                            as: 'Producto', // Ensure this alias matches the defined alias in the model associations
                            attributes: ['nombre_producto', 'precio']
                        }
                    ]
                });
                res.json(orderDetails);
            } catch (error) {
                console.error('Error al obtener detalles de órdenes:', error);
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
                    include: [
                        {
                            model: Product,
                            as: 'Producto',
                            attributes: ['nombre_producto', 'precio']
                        }
                    ]
                });
                if (orderDetails.length === 0) {
                    return res.status(404).json({ message: 'No se encontraron detalles para esta orden' });
                }
                res.json(orderDetails);
            } catch (error) {
                console.error('Error al obtener detalles de la orden:', error);
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
                    include: [
                        {
                            model: Order,
                            as: 'Orden',
                            attributes: ['orden_id', 'fecha_orden', 'estado']
                        },
                        {
                            model: Product,
                            as: 'Producto',
                            attributes: ['nombre_producto', 'precio']
                        }
                    ]
                });
                if (!orderDetail) {
                    return res.status(404).json({ message: 'Detalle de orden no encontrado' });
                }
                res.json(orderDetail);
            } catch (error) {
                console.error('Error al obtener detalle de orden:', error);
                res.status(500).json({
                    message: 'Error al obtener detalle de orden',
                    error: error.message
                });
            }
        });

        // Crear nuevo detalle de orden
        router.post('/', async (req, res) => {
            const transaction = await models.sequelize.transaction();
            try {
                const { orden_id, producto_id, cantidad, precio_unitario } = req.body;

                // Validations
                if (!orden_id || !producto_id || !cantidad || !precio_unitario) {
                    return res.status(400).json({ message: 'Todos los campos son requeridos' });
                }

                const orderDetail = await OrderDetail.create({
                    orden_id,
                    producto_id,
                    cantidad,
                    precio_unitario,
                    total: cantidad * precio_unitario
                }, { transaction });

                await transaction.commit();
                res.status(201).json(orderDetail);
            } catch (error) {
                await transaction.rollback();
                console.error('Error al crear detalle de orden:', error);
                res.status(500).json({
                    message: 'Error al crear detalle de orden',
                    error: error.message
                });
            }
        });

        // Actualizar detalle de orden
        router.put('/:id', async (req, res) => {
            const transaction = await models.sequelize.transaction();
            try {
                const { cantidad, precio_unitario } = req.body;
                const orderDetail = await OrderDetail.findByPk(req.params.id);

                if (!orderDetail) {
                    return res.status(404).json({ message: 'Detalle de orden no encontrado' });
                }

                // Update only if fields are provided
                if (cantidad !== undefined) orderDetail.cantidad = cantidad;
                if (precio_unitario !== undefined) orderDetail.precio_unitario = precio_unitario;

                // Recalculate total
                orderDetail.total = orderDetail.cantidad * orderDetail.precio_unitario;
                await orderDetail.save({ transaction });

                await transaction.commit();
                res.json(orderDetail);
            } catch (error) {
                await transaction.rollback();
                console.error('Error al actualizar detalle de orden:', error);
                res.status(500).json({
                    message: 'Error al actualizar detalle de orden',
                    error: error.message
                });
            }
        });

        // Eliminar detalle de orden
        router.delete('/:id', async (req, res) => {
            const transaction = await models.sequelize.transaction();
            try {
                const orderDetail = await OrderDetail.findByPk(req.params.id);

                if (!orderDetail) {
                    return res.status(404).json({ message: 'Detalle de orden no encontrado' });
                }

                await orderDetail.destroy({ transaction });
                await transaction.commit();
                res.json({ message: 'Detalle de orden eliminado correctamente' });
            } catch (error) {
                await transaction.rollback();
                console.error('Error al eliminar detalle de orden:', error);
                res.status(500).json({
                    message: 'Error al eliminar detalle de orden',
                    error: error.message
                });
            }
        });

        return router;
    };

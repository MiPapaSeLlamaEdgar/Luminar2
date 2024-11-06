const express = require('express');
const router = express.Router();

module.exports = (models) => {
    const { Cart, Product, Client } = models; // Importa Product y Client para las asociaciones correctas

    // Obtener todos los items del carrito
    router.get('/', async (req, res) => {
        try {
            const cartItems = await Cart.findAll({
                include: [
                    { model: Client, as: 'Cliente' },  // Carga la información del cliente
                    { model: Product, as: 'Producto' } // Usa el alias 'Producto' para cargar el producto
                ]
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
                include: [{ model: Product, as: 'Producto' }]  // Alias 'Producto' en la relación con Product
            });

            res.json(cartItems);
        } catch (error) {
            console.error("Error ", error);
            res.status(500).json({
                message: 'Error al obtener items del carrito',
                error: error.message
            });
        }
    });

    // Agregar item al carrito
    router.post('/cart', async (req, res) => { 
        console.error("entra en guardar ");
        console.error("datos ", req.body);
        try {
            const { cliente_id, producto_id, cantidad, talla, color, fecha_agregado } = req.body;

            // Crea un nuevo registro en la tabla Cart
            const cartItem = await Cart.create({
                cliente_id,
                producto_id,
                cantidad,
                fecha_agregado,
                talla,
                color,
                fecha_modificacion: new Date()
            });

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
        console.log("Cantidad que entra en controlador", req.body.cantidad); 
        console.log("ID que entra en controlador", req.params.id);
        try {
            const cartItem = await Cart.findByPk(req.params.id);
            if (!cartItem) {
                return res.status(404).json({ message: 'Item no encontrado' }); 
            }
            
            await cartItem.update({ cantidad: req.body.cantidad }); 
            res.json(cartItem);
        } catch (error) {
            console.error('Error en el controlador:', error.message); 
            res.status(500).json({
                message: 'Error al actualizar item del carrito',
                error: error.message
            });
        }
    });

    // Eliminar item del carrito
    router.delete('/:id', async (req, res) => {
        console.error("id que entra ", req.params.id);
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

    // Obtener conteo de items en el carrito por cliente
    router.get('/count/:clienteId', async (req, res) => {
        try {
            const cartCount = await Cart.count({
                where: { cliente_id: req.params.clienteId }
            });
            res.json({ count: cartCount });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener conteo de items del carrito', error: error.message });
        }
    });

    // Actualizar talla de item
    router.put('/:id/talla', async (req, res) => {
        try {
            const cartItem = await Cart.findByPk(req.params.id);
            if (!cartItem) {
                return res.status(404).json({ message: 'Item no encontrado' });
            }
            
            await cartItem.update({ talla: req.body.talla });
            res.json(cartItem);
        } catch (error) {
            console.error('Error en el controlador:', error.message);
            res.status(500).json({
                message: 'Error al actualizar talla del carrito',
                error: error.message
            });
        }
    });

    // Actualizar color de item
    router.put('/:id/color', async (req, res) => {
        try {
            const cartItem = await Cart.findByPk(req.params.id);
            if (!cartItem) {
                return res.status(404).json({ message: 'Item no encontrado' });
            }
            
            await cartItem.update({ color: req.body.color });
            res.json(cartItem);
        } catch (error) {
            console.error('Error en el controlador:', error.message);
            res.status(500).json({
                message: 'Error al actualizar color del carrito',
                error: error.message
            });
        }
    });


    return router;
};

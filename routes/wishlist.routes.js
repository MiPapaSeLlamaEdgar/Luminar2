// routes/wishlist.routes.js
const express = require('express');
const router = express.Router(); 

module.exports = (models) => {
    const { Wishlist, Client, Product, Cart } = models;

    // Obtener todos los elementos de la lista de deseos
    router.get('/', async (req, res) => {
        try {
            const wishlistItems = await Wishlist.findAll({
                include: [{ model: Client, as: 'Cliente' }, { model: Product, as: 'Producto' }]
            });
            res.json(wishlistItems);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener lista de deseos', error: error.message });
        }
    });

    // Obtener lista de deseos por cliente
    router.get('/cliente/:clienteId', async (req, res) => {
        try {
            const wishlistItems = await Wishlist.findAll({
                where: { cliente_id: req.params.clienteId },
                include: [{ model: Product, as: 'Producto' }]
            });
            res.json(wishlistItems);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener lista de deseos', error: error.message });
        }
    });

    // Obtener la cantidad de artículos en la lista de deseos por cliente
    router.get('/count', async (req, res) => {
        const clienteId = req.query.clienteId;
        try {
            const count = await Wishlist.count({ where: { cliente_id: clienteId } });
            res.json({ count });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el conteo de la lista de deseos', error: error.message });
        }
    });

    // Agregar item a la lista de deseos
     router.post('/List', async (req, res) => { 
        console.error("entra en guardar list ");
        console.error("datos ", req.body);
        try {
            const { cliente_id, producto_id, fecha_agregado } = req.body;

            // Verifica si el producto ya está en la lista de deseos
            const existingItem = await Wishlist.findOne({
                where: {
                    cliente_id,
                    producto_id
                }
            });

            if (existingItem) {
                // Si el producto ya está en la lista de deseos, avisa al usuario
                return res.status(409).json({ message: 'El producto ya está en la lista de deseos' });
            }

            // Crea un nuevo registro en la tabla Cart
            const cartItem = await Wishlist.create({
                cliente_id,
                producto_id,
                fecha_agregado,
                fecha_modificacion: new Date()
            });

            res.status(201).json(cartItem);
        } catch (error) {
            res.status(500).json({
                message: 'Error al agregar item a lista de deseos',
                error: error.message
            });
        }
    });

    // Eliminar item de la lista de deseos
    router.delete('/:id', async (req, res) => {
        console.error("id de ingreso a eliminar", req.params.id);
        try {
            const wishlistItem = await Wishlist.findByPk(req.params.id);
            if (!wishlistItem) {
                return res.status(404).json({ message: 'Item no encontrado' });
            }
            await wishlistItem.destroy();
            res.json({ message: 'Item eliminado de la lista de deseos' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar item de la lista de deseos', error: error.message });
        }
    });

    // Mover item de lista de deseos al carrito
    router.post('/add-to-cart', async (req, res) => {
        const { cliente_id, producto_id } = req.body;
        try {
            // Verificar si el producto ya está en el carrito
            const existingCartItem = await Cart.findOne({
                where: { cliente_id, producto_id }
            });

            if (existingCartItem) {
                await existingCartItem.increment('cantidad'); // Incrementar cantidad si ya está en el carrito
                res.json({ message: 'Cantidad incrementada en el carrito' });
            } else {
                await Cart.create({ cliente_id, producto_id, cantidad: 1 }); // Agregar al carrito si no está
                res.json({ message: 'Producto agregado al carrito' });
            }

            // Eliminar el producto de la lista de deseos después de moverlo al carrito
            await Wishlist.destroy({
                where: { cliente_id, producto_id }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al mover producto al carrito', error: error.message });
        }
    });

    // Obtener conteo de lista de deseos por cliente
    router.get('/count/:clienteId', async (req, res) => {
        try {
            const wishlistCount = await Wishlist.count({
                where: { cliente_id: req.params.clienteId }
            });
            res.json({ count: wishlistCount });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener conteo de lista de deseos', error: error.message });
        }
    });

    return router;
};

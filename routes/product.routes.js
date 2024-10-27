// routes/product.routes.js
const express = require('express');
const router = express.Router();

module.exports = (models) => {
    const { Product } = models;

    // Obtener todos los productos
    router.get('/', async (req, res) => {
        try {
            const products = await Product.findAll({
                include: ['Categoria']
            });
            res.json(products);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener productos',
                error: error.message
            });
        }
    });

    // Obtener un producto específico
    router.get('/:id', async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.id, {
                include: ['Categoria']
            });
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener producto',
                error: error.message
            });
        }
    });

    // Crear nuevo producto
    router.post('/', async (req, res) => {
        try {
            const product = await Product.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({
                message: 'Error al crear producto',
                error: error.message
            });
        }
    });

    // Actualizar producto
    router.put('/:id', async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            await product.update(req.body);
            res.json(product);
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar producto',
                error: error.message
            });
        }
    });

    // Eliminar producto
    router.delete('/:id', async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            await product.destroy();
            res.json({ message: 'Producto eliminado correctamente' });
        } catch (error) {
            res.status(500).json({
                message: 'Error al eliminar producto',
                error: error.message
            });
        }
    });

    return router;
};


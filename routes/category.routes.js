// routes/category.routes.js
const express = require('express');
const router = express.Router();

module.exports = (models) => {
    const { Category } = models;

    // Obtener todas las categorías
    router.get('/', async (req, res) => {
        try {
            const categories = await Category.findAll({
                include: [
                    { model: Category, as: 'CategoriaPadre' },
                    { model: Category, as: 'SubCategorias' }
                ]
            });
            res.json(categories);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener categorías',
                error: error.message
            });
        }
    });

    // Obtener una categoría específica
    router.get('/:id', async (req, res) => {
        try {
            const category = await Category.findByPk(req.params.id, {
                include: [
                    { model: Category, as: 'CategoriaPadre' },
                    { model: Category, as: 'SubCategorias' }
                ]
            });
            if (!category) {
                return res.status(404).json({ message: 'Categoría no encontrada' });
            }
            res.json(category);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener categoría',
                error: error.message
            });
        }
    });

    // Crear nueva categoría
    router.post('/', async (req, res) => {
        try {
            const category = await Category.create(req.body);
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({
                message: 'Error al crear categoría',
                error: error.message
            });
        }
    });

    // Actualizar categoría
    router.put('/:id', async (req, res) => {
        try {
            const category = await Category.findByPk(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Categoría no encontrada' });
            }
            await category.update(req.body);
            res.json(category);
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar categoría',
                error: error.message
            });
        }
    });

    // Eliminar categoría
    router.delete('/:id', async (req, res) => {
        try {
            const category = await Category.findByPk(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Categoría no encontrada' });
            }
            await category.destroy();
            res.json({ message: 'Categoría eliminada correctamente' });
        } catch (error) {
            res.status(500).json({
                message: 'Error al eliminar categoría',
                error: error.message
            });
        }
    });

    // Obtener subcategorías
    router.get('/:id/subcategorias', async (req, res) => {
        try {
            const subcategories = await Category.findAll({
                where: { categoria_padre_id: req.params.id }
            });
            res.json(subcategories);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener subcategorías',
                error: error.message
            });
        }
    });

    return router;
};


// routes/role.routes.js
const express = require('express');
const router = express.Router();

module.exports = (models) => {
    const { Role } = models;

    // Obtener todos los roles
    router.get('/', async (req, res) => {
        try {
            const roles = await Role.findAll();
            res.json(roles);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener roles',
                error: error.message
            });
        }
    });

    // Obtener un rol específico
    router.get('/:id', async (req, res) => {
        try {
            const rol = await Role.findByPk(req.params.id);
            if (!rol) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }
            res.json(rol);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener rol',
                error: error.message
            });
        }
    });

    // Crear nuevo rol
    router.post('/', async (req, res) => {
        try {
            const rol = await Role.create(req.body);
            res.status(201).json(rol);
        } catch (error) {
            res.status(500).json({
                message: 'Error al crear rol',
                error: error.message
            });
        }
    });

    // Actualizar rol
    router.put('/:id', async (req, res) => {
        try {
            const rol = await Role.findByPk(req.params.id);
            if (!rol) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }
            await rol.update(req.body);
            res.json(rol);
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar rol',
                error: error.message
            });
        }
    });

    // Eliminar rol
    router.delete('/:id', async (req, res) => {
        try {
            const rol = await Role.findByPk(req.params.id);
            if (!rol) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }
            await rol.destroy();
            res.json({ message: 'Rol eliminado correctamente' });
        } catch (error) {
            res.status(500).json({
                message: 'Error al eliminar rol',
                error: error.message
            });
        }
    });

    return router;
};


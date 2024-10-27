// routes/user.routes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

module.exports = (models) => {
    const { User } = models;

    // Obtener todos los usuarios
    router.get('/', async (req, res) => {
        try {
            const users = await User.findAll({
                include: ['Role'],
                attributes: { exclude: ['contrasena'] }
            });
            res.json(users);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener usuarios',
                error: error.message
            });
        }
    });

    // Obtener un usuario específico
    router.get('/:id', async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id, {
                include: ['Role'],
                attributes: { exclude: ['contrasena'] }
            });
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener usuario',
                error: error.message
            });
        }
    });

    // Crear nuevo usuario
    router.post('/', async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.contrasena, 10);
            const user = await User.create({
                ...req.body,
                contrasena: hashedPassword
            });
            const userWithoutPassword = user.toJSON();
            delete userWithoutPassword.contrasena;
            res.status(201).json(userWithoutPassword);
        } catch (error) {
            res.status(500).json({
                message: 'Error al crear usuario',
                error: error.message
            });
        }
    });

    // Actualizar usuario
    router.put('/:id', async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            if (req.body.contrasena) {
                req.body.contrasena = await bcrypt.hash(req.body.contrasena, 10);
            }
            await user.update(req.body);
            
            const updatedUser = await User.findByPk(req.params.id, {
                include: ['Role'],
                attributes: { exclude: ['contrasena'] }
            });
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar usuario',
                error: error.message
            });
        }
    });

    // Eliminar usuario
    router.delete('/:id', async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            await user.destroy();
            res.json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            res.status(500).json({
                message: 'Error al eliminar usuario',
                error: error.message
            });
        }
    });

    // Cambiar contraseña
    router.post('/:id/change-password', async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User.findByPk(req.params.id);
            
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Verificar contraseña actual
            const isValidPassword = await bcrypt.compare(currentPassword, user.contrasena);
            if (!isValidPassword) {
                return res.status(400).json({ message: 'Contraseña actual incorrecta' });
            }

            // Actualizar contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await user.update({ contrasena: hashedPassword });

            res.json({ message: 'Contraseña actualizada correctamente' });
        } catch (error) {
            res.status(500).json({
                message: 'Error al cambiar la contraseña',
                error: error.message
            });
        }
    });

    // Actualizar estado del usuario
    router.patch('/:id/status', async (req, res) => {
        try {
            const { estado } = req.body;
            const user = await User.findByPk(req.params.id);
            
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            await user.update({ estado });
            res.json({ message: 'Estado actualizado correctamente' });
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar estado',
                error: error.message
            });
        }
    });

    // Actualizar último acceso
    router.patch('/:id/last-access', async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            await user.update({ ultimo_acceso: new Date() });
            res.json({ message: 'Último acceso actualizado' });
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar último acceso',
                error: error.message
            });
        }
    });

    return router;
};
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (models) => {
    const { User, Role } = models;

    // Ruta de login
    router.post('/login', async (req, res) => {
        try {
            const { correo_electronico, contrasena } = req.body;

            if (!correo_electronico || !contrasena) {
                return res.status(400).json({ message: 'Correo electrónico y contraseña son requeridos' });
            }

            const user = await User.findOne({
                where: { correo_electronico },
                include: [{ model: Role, attributes: ['nombre_rol'] }]
            });

            if (!user) {
                return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
            }

            const isValidPassword = await bcrypt.compare(contrasena, user.contrasena);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
            }

            const token = jwt.sign(
                { usuario_id: user.usuario_id, rol_id: user.rol_id },
                process.env.JWT_SECRET || 'tu_clave_secreta',
                { expiresIn: '24h' }
            );

            await user.update({ ultimo_acceso: new Date() });

            res.json({
                token,
                usuario_id: user.usuario_id,
                rol_id: user.rol_id,
                nombre: user.nombre,
                correo_electronico: user.correo_electronico,
                estado: user.estado
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
        }
    });

    // Crear nuevo usuario (registro)
    router.post('/', async (req, res) => {
        try {
            const { nombre, correo_electronico, contrasena, rol_id } = req.body;

            if (!nombre || !correo_electronico || !contrasena || !rol_id) {
                return res.status(400).json({ message: 'Todos los campos son requeridos' });
            }

            const existingUser = await User.findOne({ where: { correo_electronico } });

            if (existingUser) {
                return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
            }

            const hashedPassword = await bcrypt.hash(contrasena, 10);

            const user = await User.create({
                ...req.body,
                contrasena: hashedPassword,
                fecha_registro: new Date(),
                estado: 'activo'
            });

            const token = jwt.sign(
                { usuario_id: user.usuario_id, rol_id: user.rol_id },
                process.env.JWT_SECRET || 'tu_clave_secreta',
                { expiresIn: '24h' }
            );

            const userResponse = user.toJSON();
            delete userResponse.contrasena;

            res.status(201).json({ ...userResponse, token });

        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({ message: 'Error al crear usuario', error: error.message });
        }
    });

    // Obtener todos los usuarios
    router.get('/', async (req, res) => {
        try {
            const users = await User.findAll({
                include: [{ model: Role, attributes: ['nombre_rol'] }],
                attributes: { exclude: ['contrasena'] }
            });
            res.json(users);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
        }
    });

    // Obtener un usuario específico
    router.get('/:id', async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id, {
                include: [{ model: Role, attributes: ['nombre_rol'] }],
                attributes: { exclude: ['contrasena'] }
            });

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.json(user);
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
        }
    });

    // Actualizar usuario
    router.put('/:id', async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            if (req.body.correo_electronico && req.body.correo_electronico !== user.correo_electronico) {
                const existingUser = await User.findOne({ where: { correo_electronico: req.body.correo_electronico } });
                if (existingUser) {
                    return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
                }
            }

            if (req.body.contrasena) {
                req.body.contrasena = await bcrypt.hash(req.body.contrasena, 10);
            } else {
                delete req.body.contrasena;
            }

            await user.update(req.body);

            const updatedUser = await User.findByPk(req.params.id, {
                include: [{ model: Role, attributes: ['nombre_rol'] }],
                attributes: { exclude: ['contrasena'] }
            });

            res.json(updatedUser);
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
        }
    });

    // Eliminar un usuario
    router.delete('/:id', async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            await user.destroy();
            res.json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
        }
    });

    return router;
};

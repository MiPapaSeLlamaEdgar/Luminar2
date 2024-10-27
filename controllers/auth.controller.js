const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize) => {
    const Usuario = sequelize.models.Usuario;
    const Cliente = sequelize.models.Cliente;

    // Ruta de registro
    router.post('/register', async (req, res) => {
        const { 
            nombre, 
            apellido, 
            correo_electronico, 
            contrasena,
            telefono,
            direccion 
        } = req.body;

        try {
            const usuarioExistente = await Usuario.findOne({ 
                where: { correo_electronico } 
            });

            if (usuarioExistente) {
                return res.status(400).json({ msg: 'El correo ya está registrado' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contrasena, salt);

            const result = await sequelize.transaction(async (t) => {
                const nuevoUsuario = await Usuario.create({
                    nombre,
                    apellido,
                    correo_electronico,
                    contrasena: hashedPassword,
                    rol_id: 1,
                    estado: 'activo'
                }, { transaction: t });

                const nuevoCliente = await Cliente.create({
                    usuario_id: nuevoUsuario.usuario_id,
                    nombre,
                    apellido,
                    correo_electronico,
                    telefono,
                    direccion
                }, { transaction: t });

                return { nuevoUsuario, nuevoCliente };
            });

            const token = jwt.sign(
                {
                    userId: result.nuevoUsuario.usuario_id,
                    clienteId: result.nuevoCliente.cliente_id,
                    rol_id: 1,
                    nombre: result.nuevoUsuario.nombre
                },
                process.env.JWT_SECRET || 'secret_temporal',
                { expiresIn: '1h' }
            );

            res.status(201).json({
                token,
                rol_id: 1,
                nombre: result.nuevoUsuario.nombre
            });

        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({ msg: 'Error del servidor' });
        }
    });

    // Ruta de login
    router.post('/login', async (req, res) => {
        const { correo_electronico, contrasena } = req.body;

        try {
            const usuario = await Usuario.findOne({
                where: { correo_electronico },
                include: [Cliente]
            });

            if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
                return res.status(400).json({ msg: 'Credenciales inválidas' });
            }

            if (usuario.estado !== 'activo') {
                return res.status(400).json({ msg: 'Usuario inactivo' });
            }

            await usuario.update({ ultimo_acceso: new Date() });

            const token = jwt.sign(
                {
                    userId: usuario.usuario_id,
                    clienteId: usuario.Cliente?.cliente_id,
                    rol_id: usuario.rol_id,
                    nombre: usuario.nombre
                },
                process.env.JWT_SECRET || 'secret_temporal',
                { expiresIn: '1h' }
            );

            res.json({
                token,
                rol_id: usuario.rol_id,
                nombre: usuario.nombre
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ msg: 'Error en el servidor' });
        }
    });

    return router;
};
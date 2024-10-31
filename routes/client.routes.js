// routes/client.routes.js
const express = require('express');
const router = express.Router();

module.exports = (models) => {
    const { Client } = models;

    // Obtener todos los clientes
    router.get('/', async (req, res) => {
        try {
            const clients = await Client.findAll();
            res.json(clients);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            res.status(500).json({
                message: 'Error al obtener clientes',
                error: error.message
            });
        }
    });

    // Obtener un cliente específico
    router.get('/:id', async (req, res) => {
        try {
            const client = await Client.findByPk(req.params.id);
            if (!client) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }
            res.json(client);
        } catch (error) {
            console.error('Error al obtener cliente:', error);
            res.status(500).json({
                message: 'Error al obtener cliente',
                error: error.message
            });
        }
    });

    // Crear nuevo cliente
    router.post('/', async (req, res) => {
        try {
            // Validar campos obligatorios
            const { nombre, apellido, correo_electronico, telefono, direccion } = req.body;
            if (!nombre || !apellido || !correo_electronico) {
                return res.status(400).json({
                    message: 'Nombre, apellido y correo electrónico son obligatorios'
                });
            }

            // Crear nuevo cliente
            const client = await Client.create({
                nombre,
                apellido,
                correo_electronico,
                telefono,
                direccion,
                fecha_registro: new Date() // Establecer fecha de registro
            });

            res.status(201).json(client);
        } catch (error) {
            console.error('Error al crear cliente:', error);
            res.status(500).json({
                message: 'Error al crear cliente',
                error: error.message
            });
        }
    });

    // Actualizar cliente
    router.put('/:id', async (req, res) => {
        try {
            // Buscar el cliente por su ID
            const client = await Client.findByPk(req.params.id);
            if (!client) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }

            // Validar si se están proporcionando los campos necesarios para la actualización
            const { nombre, apellido, correo_electronico } = req.body;
            if (!nombre && !apellido && !correo_electronico) {
                return res.status(400).json({
                    message: 'Debe proporcionar al menos un campo para actualizar'
                });
            }

            // Actualizar cliente con los datos proporcionados
            await client.update(req.body);
            res.json(client);
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            res.status(500).json({
                message: 'Error al actualizar cliente',
                error: error.message
            });
        }
    });

    // Eliminar cliente
    router.delete('/:id', async (req, res) => {
        try {
            // Buscar el cliente por su ID
            const client = await Client.findByPk(req.params.id);
            if (!client) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }

            // Eliminar el cliente
            await client.destroy();
            res.json({ message: 'Cliente eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            res.status(500).json({
                message: 'Error al eliminar cliente',
                error: error.message
            });
        }
    });

    return router;
};

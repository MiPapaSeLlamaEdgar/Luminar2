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
            res.status(500).json({
                message: 'Error al obtener cliente',
                error: error.message
            });
        }
    });

    // Crear nuevo cliente
    router.post('/', async (req, res) => {
        try {
            const client = await Client.create(req.body);
            res.status(201).json(client);
        } catch (error) {
            res.status(500).json({
                message: 'Error al crear cliente',
                error: error.message
            });
        }
    });

    // Actualizar cliente
    router.put('/:id', async (req, res) => {
        try {
            const client = await Client.findByPk(req.params.id);
            if (!client) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }
            await client.update(req.body);
            res.json(client);
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar cliente',
                error: error.message
            });
        }
    });

    // Eliminar cliente
    router.delete('/:id', async (req, res) => {
        try {
            const client = await Client.findByPk(req.params.id);
            if (!client) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }
            await client.destroy();
            res.json({ message: 'Cliente eliminado correctamente' });
        } catch (error) {
            res.status(500).json({
                message: 'Error al eliminar cliente',
                error: error.message
            });
        }
    });

    return router;
};


const express = require('express');
const router = express.Router();
const { Role } = require('../models'); // Asegúrate de que la ruta sea correcta

// Obtener todos los roles
router.get('/', async (req, res) => {
    try {
        const roles = await Role.findAll({
            order: [['rol_id', 'ASC']]
        });
        res.json(roles);
    } catch (error) {
        console.error('Error al obtener roles:', error);
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
            return res.status(404).json({
                message: 'Rol no encontrado'
            });
        }
        res.json(rol);
    } catch (error) {
        console.error('Error al obtener rol:', error);
        res.status(500).json({
            message: 'Error al obtener rol',
            error: error.message
        });
    }
});

// Crear nuevo rol
router.post('/', async (req, res) => {
    try {
        const { nombre_rol, descripcion, permisos } = req.body;
        
        // Validaciones básicas
        if (!nombre_rol) {
            return res.status(400).json({
                message: 'El nombre del rol es requerido'
            });
        }

        // Crear el rol
        const nuevoRol = await Role.create({
            nombre_rol,
            descripcion,
            permisos: typeof permisos === 'string' ? permisos : JSON.stringify(permisos)
        });

        res.status(201).json({
            message: 'Rol creado exitosamente',
            rol: nuevoRol
        });
    } catch (error) {
        console.error('Error al crear rol:', error);
        res.status(500).json({
            message: 'Error al crear rol',
            error: error.message
        });
    }
});

// Actualizar rol
router.put('/:id', async (req, res) => {
    try {
        const { nombre_rol, descripcion, permisos } = req.body;
        const rol = await Role.findByPk(req.params.id);

        if (!rol) {
            return res.status(404).json({
                message: 'Rol no encontrado'
            });
        }

        // Actualizar el rol
        await rol.update({
            nombre_rol: nombre_rol || rol.nombre_rol,
            descripcion: descripcion || rol.descripcion,
            permisos: typeof permisos === 'string' ? permisos : JSON.stringify(permisos)
        });

        res.json({
            message: 'Rol actualizado exitosamente',
            rol
        });
    } catch (error) {
        console.error('Error al actualizar rol:', error);
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
            return res.status(404).json({
                message: 'Rol no encontrado'
            });
        }

        // Verificar si el rol está siendo usado por usuarios
        const usuariosConRol = await rol.countUsuarios(); // Asegúrate de tener la relación definida
        if (usuariosConRol > 0) {
            return res.status(400).json({
                message: 'No se puede eliminar el rol porque está siendo usado por usuarios'
            });
        }

        await rol.destroy();
        res.json({
            message: 'Rol eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar rol:', error);
        res.status(500).json({
            message: 'Error al eliminar rol',
            error: error.message
        });
    }
});

// Middleware de manejo de errores
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

module.exports = router;
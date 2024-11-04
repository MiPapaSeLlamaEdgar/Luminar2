const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

module.exports = (models) => {
    const { Product, Category } = models;

    // Configurar almacenamiento con multer
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../public/images'));  
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname)); 
        }
    });

    const upload = multer({ storage: storage });

    // Obtener todos los productos
    router.get('/', async (req, res) => {
        try {
            const products = await Product.findAll({
                include: {
                    model: Category,
                    as: 'Categoria',
                    attributes: ['nombre_categoria']
                }
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
                include: {
                    model: Categoria,
                    as: 'Categoria',
                    attributes: ['nombre_categoria']
                }
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
    router.post('/', upload.single('imagenes'), async (req, res) => {
        try {
            const imageUrl = req.file ? `/images/${req.file.filename}` : null;
            const productData = { ...req.body, imagenes: imageUrl };
            const product = await Product.create(productData);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({
                message: 'Error al crear producto',
                error: error.message
            });
        }
    });

    // Actualizar producto
    router.put('/:id', upload.single('imagenes'), async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            
            // Si hay una nueva imagen, usa esa; si no, mantén la existente
            const imageUrl = req.file ? `/images/${req.file.filename}` : product.imagenes; 
            const updatedData = { ...req.body, imagenes: imageUrl };
            
            await product.update(updatedData);
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

    // Configura la carpeta pública para que sea accesible
    router.use('/images', express.static(path.join(__dirname, '../public/images')));

    return router;
};
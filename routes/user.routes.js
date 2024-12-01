const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const config = require('../config');

module.exports = (models) => {
    const { User, Role } = models;

    // Configuración de nodemailer para el envío de correos
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS,
        },
    });
    let recoveryData = {};

    // Configuración de multer para guardar los archivos subidos
    router.post('/Codigo/Verificar', async (req, res) => {
        const { correo_electronico } = req.body;
    
        try {
            const user = await User.findOne({ where: { correo_electronico } });
    
            if (!user) {
                return res.status(404).json({ message: 'Correo no 12 encontrado' });
            }
    
            const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
            delete recoveryData[correo_electronico];
            recoveryData[correo_electronico] = recoveryCode;
           
            //const recoveryLink = `http://localhost:5000/recuperar-password?email=${correo_electronico}&code=${recoveryCode}`;
            const recoveryLink = `https://luminar2-production.up.railway.app/recuperar-password?email=${correo_electronico}&code=${recoveryCode}`;

            transporter.sendMail({
                from: 'luminar.correo@gmail.com',
                to: correo_electronico,
                subject: 'Código de recuperación de contraseña',
                html: `
                    <p>Haz clic en el siguiente enlace para recuperar tu contraseña:</p>
                    <p><a href="${recoveryLink}">Haz clic aquí</a></p>
                    <p>Tu código de recuperación es: <strong>${recoveryCode}</strong></p>
                `
            }, (error, info) => {
                if (error) {
                    console.error('Error al enviar el correo:', error);
                    return res.status(500).json({ message: 'Error al enviar el correo' });
                }
                res.status(200).json({ message: 'Código enviado al correo' });
            });
        } catch (error) {
            console.error('Error en el servidor:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    });

    // Configuración de multer para guardar los archivos subidos
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../public/images')); 
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });

    // Inicializa multer con la configuración de almacenamiento
    const upload = multer({ storage: storage });

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
                return res.status(404).json({ message: 'Usuario no 15 encontrado' });
            }

            res.json(user);
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
        }
    });

    // Actualizar usuario
    router.post('/:id', async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            
            if (!user) {
                return res.status(404).json({ message: 'Usuario no 2 encontrado' });
            }
    
            // Verificar si se está actualizando el correo
            if (req.body.correo_electronico && req.body.correo_electronico !== user.correo_electronico) {
                const existingUser = await User.findOne({
                    where: { correo_electronico: req.body.correo_electronico }
                });
    
                if (existingUser) {
                    return res.status(400).json({
                        message: 'El correo electrónico ya está registrado'
                    });
                }
            }

            // Verificar si se desea cambiar la contraseña
            if (req.body.Antigua_contrasena && req.body.nueva_contrasena) {
                const isValidPassword = await bcrypt.compare(req.body.Antigua_contrasena, user.contrasena);
                if (!isValidPassword) {
                    console.error('Error isValidPassword:', isValidPassword);
                    return res.status(401).json({ message: 'Error al verificar la contraseña actual' });
                }

                // Si la contraseña es válida, la encriptamos
                user.contrasena = await bcrypt.hash(req.body.nueva_contrasena, 10);
            }
 
            // Preparar los datos para la actualización
            const updateData = {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                correo_electronico: req.body.correo_electronico,
                fecha_registro: req.body.fecha_registro,
                ultimo_acceso: req.body.ultimo_acceso,
                ...(req.body.nueva_contrasena && { contrasena: user.contrasena }) 
            };

            await user.update(updateData);
            
            const updatedUser = await User.findByPk(req.params.id, {
                include: [{
                    model: Role,
                    attributes: ['nombre_rol']
                }],
                attributes: { exclude: ['contrasena'] }
            });
    
            res.json(updatedUser);
        } catch (error) {
            console.error('Error específico:', error); 
            res.status(500).json({
                message: 'Error al actualizar usuario....',
                error: error.message
            });
        }
    });

    // Eliminar un usuario
    router.delete('/:id', async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);

            if (!user) {
                return res.status(404).json({ message: 'Usuario no 3 encontrado' });
            }

            await user.destroy();
            res.json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
        }
    });

    // Ruta para cargar las imágenes de perfil
    router.post('/upload-photo/:id', upload.single('profilePhoto'), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).send('No se subió ningún archivo.');
            }

            const user = await User.findByPk(req.params.id);
                
            if (!user) {
                return res.status(404).json({ message: 'Usuario no 4 encontrado' });
            }
        
            // Procesar la imagen subida
            const imagen_perfil = `/images/${req.file.filename}`; 
        
            await user.update({ imagen_perfil }); 

            res.status(200).send(`Imagen subida exitosamente. Ruta: ${imagen_perfil}`);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al subir la imagen' });
        }
    });

    // Configura la carpeta pública para que sea accesible
    router.use('/images', express.static(path.join(__dirname, '../public/images')));
    
    // Ruta para verificar el código y cambiar la contraseña
    router.post('/verificar-codigo/code', async (req, res) => {
        const { correo_electronico, code, newPassword } = req.body;
    
        console.log("code -",code);
        console.log("recoveryData[correo_electronico] -",recoveryData[correo_electronico]);
        console.log("correo_electronico -",correo_electronico);
        


        // Verifica si el código ingresado es correcto
        if (recoveryData[correo_electronico] !== code) {
            return res.status(400).json({ message: 'Código incorrecto' });
        }
    
        // Si el código es correcto, encripta la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        // Actualiza la contraseña del usuario
        User.findOne({ where: { correo_electronico } })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'Usuario no 1 encontrado' });
                }
    
                user.contrasena = hashedPassword;
                return user.save(); // Guarda la nueva contraseña en la base de datos
            })
            .then(() => {
                // Limpia el código temporal después de cambiar la contraseña
                delete recoveryData[correo_electronico];
                res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
            })
            .catch(error => {
                console.error('Error al actualizar la contraseña:', error);
                res.status(500).json({ message: 'Error al actualizar la contraseña' });
            });
    });

    return router;
};

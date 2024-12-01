// auth.js
class AuthController {
    constructor() {
        this.API_ROUTES = {
            register: '/api/user',
            login: '/api/user/login',
            lastAccess: '/api/user/:id/last-access',
            createClient: '/api/client' // Ruta para crear cliente
        };

        this.REDIRECT_ROUTES = {
            1: '/indexCliente',
            2: '/Vendedor/dashboard-vendedor',
            3: '/dashboard-admin'
        };

        document.addEventListener('DOMContentLoaded', () => this.initializeEventListeners());
    }

    initializeEventListeners() {
        try {
            const container = document.getElementById('container');
            const registerBtn = document.getElementById('signUp');
            const loginBtn = document.getElementById('signIn');
            const registerFormBtn = document.getElementById('register');
            const loginFormBtn = document.getElementById('login');
            const registerForm = document.getElementById('register-form');
            const loginForm = document.getElementById('login-form');

            if (!container || !registerBtn || !loginBtn || !registerFormBtn || !loginFormBtn || !registerForm || !loginForm) {
                throw new Error('Elementos del DOM no encontrados');
            }

            registerBtn.addEventListener('click', () => container.classList.add("active"));
            loginBtn.addEventListener('click', () => container.classList.remove("active"));

            registerFormBtn.addEventListener('click', (e) => this.handleRegister(e));
            loginFormBtn.addEventListener('click', (e) => this.handleLogin(e));
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));

        } catch (error) {
            console.error('Error al inicializar eventos:', error);
        }
    }

    async handleRegister(event) {
        event?.preventDefault();

        try {
            const commonData = {
                nombre: document.getElementById('register-nombre').value.trim(),
                apellido: document.getElementById('register-apellido').value.trim(),
                correo_electronico: document.getElementById('register-email').value.trim(),
                telefono: document.getElementById('register-telefono').value.trim(),
                direccion: document.getElementById('register-direccion').value.trim()
            };

            const userData = {
                ...commonData,
                contrasena: document.getElementById('register-password').value.trim(),
                rol_id: 1, // Cliente por defecto
                estado: 'activo',
                fecha_registro: new Date().toISOString()
            };

            await this.validateFormData(userData);

            // Crear el usuario
            const userResponse = await fetch(this.API_ROUTES.register, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!userResponse.ok) {
                const error = await userResponse.json();
                throw new Error(error.message || 'Error en el registro de usuario');
            }

            const userData_response = await userResponse.json();

            // Crear el cliente después de la creación del usuario
            const clientData = {
                usuario_id: userData_response.usuario_id, // Asociar con el usuario recién creado
                ...commonData,
                fecha_registro: new Date().toISOString()
            };

            const clientResponse = await fetch(this.API_ROUTES.createClient, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userData_response.token}`
                },
                body: JSON.stringify(clientData)
            });

            if (!clientResponse.ok) {
                const error = await clientResponse.json();
                throw new Error(error.message || 'Error en el registro de cliente');
            }

            const clientData_response = await clientResponse.json();

            // Guardar datos en localStorage
            this.saveUserData({
                ...userData_response,
                cliente_id: clientData_response.cliente_id
            });

            await this.handleAuthSuccess(userData_response, 'Registro exitoso');

        } catch (error) {
            this.handleError(error);
        }
    }

    async handleLogin(event) {
        event?.preventDefault();

        try {
            const formData = {
                correo_electronico: document.getElementById('login-email').value.trim(),
                contrasena: document.getElementById('login-password').value.trim()
            };

            if (!formData.correo_electronico || !formData.contrasena) {
                throw new Error('Por favor, complete todos los campos');
            }

            const response = await fetch(this.API_ROUTES.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Credenciales inválidas');
            }

            const data = await response.json();

            if (data.rol_id === 1) {
                const clientResponse = await fetch(`/api/client/email/${formData.correo_electronico}`, {
                    headers: {
                        'Authorization': `Bearer ${data.token}`
                    }
                });

                if (clientResponse.ok) {
                    const clientData = await clientResponse.json();
                    data.cliente_id = clientData.cliente_id;
                }
            }

            this.saveUserData(data);
            await this.updateLastAccess(data);
            await this.handleAuthSuccess(data, 'Inicio de sesión exitoso');

        } catch (error) {
            this.handleError(error);
        }
    }

    saveUserData(data) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario_id', data.usuario_id);
        localStorage.setItem('rol_id', data.rol_id);
        localStorage.setItem('nombre', data.nombre);
        if (data.cliente_id) {
            localStorage.setItem('cliente_id', data.cliente_id);
        }
    }

    async validateFormData(formData) {
        if (Object.values(formData).some(value => !value)) {
            throw new Error('Por favor, complete todos los campos');
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(formData.contrasena)) {
            throw new Error('La contraseña debe tener al menos 6 caracteres, incluyendo letras y números');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.correo_electronico)) {
            throw new Error('Por favor, ingrese un correo electrónico válido');
        }
    }

    async handleAuthSuccess(data, message) {
        await Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: message,
            timer: 2000,
            showConfirmButton: false
        });

        const redirectUrl = this.REDIRECT_ROUTES[data.rol_id];
        if (!redirectUrl) throw new Error('Rol no válido');

        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 2000);
    }

    async updateLastAccess(data) {
        try {
            await fetch(this.API_ROUTES.lastAccess.replace(':id', data.usuario_id), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                }
            });
        } catch (error) {
            console.warn('No se pudo actualizar el último acceso:', error);
        }
    }

    handleError(error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    }
}

// Inicializar el controlador
new AuthController();

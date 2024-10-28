document.addEventListener('DOMContentLoaded', function() {
    // Configuración de rutas API
    const API_ROUTES = {
        register: '/api/users',
        login: '/api/users/login', // Cambiado para coincidir con tu estructura
        lastAccess: '/api/users/:id/last-access'
    };

    // Elementos DOM
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('signUp');
    const loginBtn = document.getElementById('signIn');
    const registerFormBtn = document.getElementById('register');
    const loginFormBtn = document.getElementById('login');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    // Mostrar/Ocultar formularios
    registerBtn?.addEventListener('click', () => container.classList.add("active"));
    loginBtn?.addEventListener('click', () => container.classList.remove("active"));

    // Función para registrar usuario
    async function registrarUsuario(event) {
        event?.preventDefault();
        
        try {
            const formData = {
                nombre: document.getElementById('register-nombre').value.trim(),
                apellido: document.getElementById('register-apellido').value.trim(),
                correo_electronico: document.getElementById('register-email').value.trim(),
                contrasena: document.getElementById('register-password').value.trim(),
                telefono: document.getElementById('register-telefono').value.trim(),
                direccion: document.getElementById('register-direccion').value.trim(),
                rol_id: 1, // Por defecto, rol de cliente
                estado: 'activo',
                fecha_registro: new Date().toISOString()
            };

            // Validaciones
            if (Object.values(formData).some(value => !value)) {
                throw new Error('Por favor, complete todos los campos');
            }

            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
            if (!passwordRegex.test(formData.contrasena)) {
                throw new Error('La contraseña debe tener al menos 6 caracteres, incluyendo letras y números');
            }

            const response = await fetch(API_ROUTES.register, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en el registro');
            }

            const data = await response.json();

            // Validar datos recibidos
            if (!data.usuario_id || !data.rol_id) {
                throw new Error('Datos de usuario incompletos');
            }

            // Guardar datos en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario_id', data.usuario_id);
            localStorage.setItem('rol_id', data.rol_id);
            localStorage.setItem('nombre', data.nombre);

            await Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: `Bienvenido, ${data.nombre}!`,
                timer: 2000,
                showConfirmButton: false
            });

            // Redirigir según el rol
            const redirectRoutes = {
                1: '/Cliente/dashboard-cliente',
                2: '/Vendedor/dashboard-vendedor',
                3: '/Admin/dashboard-admin'
            };

            const redirectUrl = redirectRoutes[data.rol_id];
            if (!redirectUrl) throw new Error('Rol no válido');
            
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 2000);

        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de registro',
                text: error.message
            });
        }
    }

    // Función para iniciar sesión
    async function iniciarSesion(event) {
        event?.preventDefault();
        
        try {
            const formData = {
                correo_electronico: document.getElementById('login-email').value.trim(),
                contrasena: document.getElementById('login-password').value.trim()
            };

            if (!formData.correo_electronico || !formData.contrasena) {
                throw new Error('Por favor, complete todos los campos');
            }

            const response = await fetch(API_ROUTES.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Credenciales inválidas');
            }

            const data = await response.json();

            // Validar datos recibidos
            if (!data.usuario_id || !data.rol_id) {
                throw new Error('Datos de usuario incompletos');
            }

            // Guardar datos en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario_id', data.usuario_id);
            localStorage.setItem('rol_id', data.rol_id);
            localStorage.setItem('nombre', data.nombre);

            // Actualizar último acceso
            try {
                await fetch(API_ROUTES.lastAccess.replace(':id', data.usuario_id), {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${data.token}`
                    }
                });
            } catch (error) {
                console.warn('No se pudo actualizar el último acceso:', error);
            }

            await Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: `Bienvenido de nuevo, ${data.nombre}!`,
                timer: 2000,
                showConfirmButton: false
            });

            // Redirigir según el rol
            const redirectRoutes = {
                1: '/Cliente/dashboard-cliente',
                2: '/Vendedor/dashboard-vendedor',
                3: '/Admin/dashboard-admin'
            };

            const redirectUrl = redirectRoutes[data.rol_id];
            if (!redirectUrl) throw new Error('Rol no válido');
            
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 2000);

        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de inicio de sesión',
                text: error.message
            });
        }
    }

    // Event Listeners
    registerFormBtn?.addEventListener('click', registrarUsuario);
    loginFormBtn?.addEventListener('click', iniciarSesion);
    registerForm?.addEventListener('submit', registrarUsuario);
    loginForm?.addEventListener('submit', iniciarSesion);

    // Manejar evento Enter
    registerForm?.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            registrarUsuario();
        }
    });

    loginForm?.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            iniciarSesion();
        }
    });
});
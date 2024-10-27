// public/js/auth.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('signUp');
    const loginBtn = document.getElementById('signIn');
    const registerFormBtn = document.getElementById('register');
    const loginFormBtn = document.getElementById('login');

    // Mostrar/Ocultar formularios
    registerBtn.addEventListener('click', () => container.classList.add("active"));
    loginBtn.addEventListener('click', () => container.classList.remove("active"));

    // Función para registrar usuario
    async function registrarUsuario() {
        try {
            const formData = {
                nombre: document.getElementById('register-nombre').value.trim(),
                apellido: document.getElementById('register-apellido').value.trim(),
                correo_electronico: document.getElementById('register-email').value.trim(),
                contrasena: document.getElementById('register-password').value.trim(),
                telefono: document.getElementById('register-telefono').value.trim(),
                direccion: document.getElementById('register-direccion').value.trim()
            };

            // Validaciones
            if (Object.values(formData).some(value => !value)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, complete todos los campos'
                });
                return;
            }

            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
            if (!passwordRegex.test(formData.contrasena)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Contraseña inválida',
                    text: 'La contraseña debe tener al menos 6 caracteres, incluyendo letras y números'
                });
                return;
            }

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.msg || 'Error en el registro');
            }

            const data = await response.json();

            // Guardar datos en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('rol_id', data.rol_id);
            localStorage.setItem('nombre', data.nombre);

            await Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: `Bienvenido, ${formData.nombre}!`,
                timer: 2000,
                showConfirmButton: false
            });

            // Redirigir según el rol
            switch (parseInt(data.rol_id)) {
                case 1: window.location.href = '/dashboard-cliente'; break;
                case 2: window.location.href = '/dashboard-vendedor'; break;
                case 3: window.location.href = '/dashboard-admin'; break;
                default: throw new Error('Rol no válido');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error al registrar usuario'
            });
        }
    }

    // Función para iniciar sesión
    async function iniciarSesion() {
        try {
            const formData = {
                correo_electronico: document.getElementById('login-email').value.trim(),
                contrasena: document.getElementById('login-password').value.trim()
            };

            if (!formData.correo_electronico || !formData.contrasena) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, complete todos los campos'
                });
                return;
            }

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.msg || 'Credenciales inválidas');
            }

            const data = await response.json();

            // Guardar datos en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('rol_id', data.rol_id);
            localStorage.setItem('nombre', data.nombre);

            await Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Inicio de sesión exitoso',
                timer: 2000,
                showConfirmButton: false
            });

            // Redirigir según el rol
            switch (parseInt(data.rol_id)) {
                case 1: window.location.href = '/dashboard-cliente'; break;
                case 2: window.location.href = '/dashboard-vendedor'; break;
                case 3: window.location.href = '/dashboard-admin'; break;
                default: throw new Error('Rol no válido');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error al iniciar sesión'
            });
        }
    }

    // Event Listeners
    registerFormBtn.addEventListener('click', registrarUsuario);
    loginFormBtn.addEventListener('click', iniciarSesion);

    // Manejar evento Enter
    document.getElementById('register-form').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            registrarUsuario();
        }
    });

    document.getElementById('login-form').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            iniciarSesion();
        }
    });
});
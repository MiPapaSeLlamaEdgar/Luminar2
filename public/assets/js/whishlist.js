// assets/js/wishlist.js

document.addEventListener('DOMContentLoaded', function() {
    // Función para actualizar el contador de la lista de deseos
    const updateWishlistCount = async () => {
        try {
            const response = await fetch('/api/wishlist/count');
            const data = await response.json();
            const countElements = document.querySelectorAll('.count');
            countElements.forEach(element => {
                element.textContent = data.count;
            });
        } catch (error) {
            console.error('Error al actualizar contador:', error);
        }
    };

    // Función para manejar el botón de lista de deseos
    const handleWishlistButton = async (button, productName, productPrice) => {
        try {
            const response = await fetch('/api/wishlist/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre_producto: productName,
                    precio: productPrice
                })
            });

            const data = await response.json();

            // Mostrar mensaje de éxito
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });

            Toast.fire({
                icon: 'success',
                title: data.message
            });

            // Actualizar el ícono del botón
            const isInWishlist = button.classList.contains('in-wishlist');
            button.classList.toggle('in-wishlist');
            button.style.backgroundColor = isInWishlist ? 'var(--first-color-alt)' : 'var(--first-color)';
            button.style.color = isInWishlist ? 'var(--text-color)' : 'var(--body-color)';

            // Actualizar el contador
            updateWishlistCount();

        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al actualizar la lista de deseos'
            });
        }
    };

    // Agregar event listeners a todos los botones de lista de deseos
    document.querySelectorAll('.action__btn[aria-label="Add to Wishlist"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product__item');
            const productName = productCard.querySelector('.product__title').textContent;
            const productPrice = productCard.querySelector('.new__price').textContent.replace('$', '');
            
            handleWishlistButton(this, productName, productPrice);
        });
    });

    // Inicializar el contador al cargar la página
    updateWishlistCount();
});
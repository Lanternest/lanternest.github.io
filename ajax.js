// Funciones para cargar y mostrar productos desde JSON
async function cargarProductos() {
    try {
        const response = await fetch('/data/data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error cargando los productos:', error);
        return null;
    }
}

// Función para mostrar productos de una marca específica
async function mostrarProductos(brand) {
    const data = await cargarProductos();
    if (!data || !data[brand]) return;

    const container = document.querySelector('#card_product_container');
    if (!container) return;

    const products = data[brand];
    container.innerHTML = products.map(product => `
        <div class="card_product">
            <div class="image-box">
                <img src="${product.img}" alt="${product.modelo}">
            </div>
            <div class="content">
                <h2>${product.modelo}</h2>
                <p>${product.descripcion}</p>
            </div>
        </div>
    `).join('');
}

// Sistema de búsqueda
function setupSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar modelos...';
    searchInput.classList.add('search-input');

    // Insertar el campo de búsqueda después del nav
    const nav = document.querySelector('nav');
    if (nav) {
        nav.insertAdjacentElement('afterend', searchInput);
    }

    searchInput.addEventListener('input', async function() {
        const searchTerm = this.value.toLowerCase();
        const data = await cargarProductos();
        if (!data) return;

        // Buscar en todas las marcas
        let allProducts = [];
        for (const brand in data) {
            allProducts = allProducts.concat(data[brand]);
        }

        // Filtrar productos
        const filteredProducts = allProducts.filter(product =>
            product.modelo.toLowerCase().includes(searchTerm)
        );

        // Mostrar resultados
        const container = document.querySelector('#card_product_container') || document.querySelector('.card_container');
        if (!container) return;

        container.innerHTML = filteredProducts.map(product => `
            <div class="card_product">
                <div class="image-box">
                    <img src="${product.img}" alt="${product.modelo}">
                </div>
                <div class="content">
                    <h2>${product.modelo}</h2>
                    <p>${product.descripcion}</p>
                </div>
            </div>
        `).join('');
    });
}

// Validación del formulario de contacto
function FormValidacion() {
    const form = document.querySelector('.contact_form form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Obtener campos
        const nombre = document.querySelector('input[name="nombre"]');
        const email = document.querySelector('input[name="email"]');
        const mensaje = document.querySelector('textarea[name="mensaje"]');

        // Reset previos errores
        limpiarErrores();

        let isValid = true;

        // Validar nombre
        if (!nombre.value.trim()) {
            mostrarError(nombre, 'El nombre es obligatorio');
            isValid = false;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value)) {
            mostrarError(email, 'Ingresa un email válido');
            isValid = false;
        }

        // Validar mensaje
        if (!mensaje.value.trim()) {
            mostrarError(mensaje, 'El mensaje es obligatorio');
            isValid = false;
        }

        if (isValid) {
            // Aquí iría el código para enviar el formulario
            alert('¡Formulario enviado con éxito!');
            form.reset();
        }
    });
}

// Funciones auxiliares para la validación del formulario
function mostrarError(element, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#c01d1d';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '-8px';
    errorDiv.style.marginBottom = '8px';
    errorDiv.textContent = message;
    element.parentNode.insertBefore(errorDiv, element.nextSibling);
    element.style.borderColor = '#c01d1d';
}

function limpiarErrores() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.remove());
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => input.style.borderColor = '#353935');
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Detectar la página actual
    const paginaActual = window.location.pathname;

    if (paginaActual.includes('ford.html')) {
        mostrarProductos('ford');
    } else if (paginaActual.includes('chevrolet.html')) {
        mostrarProductos('chevrolet');
    } else if (paginaActual.includes('dodge.html')) {
        mostrarProductos('dodge');
    }

    // Configurar búsqueda en todas las páginas excepto contacto
    if (!paginaActual.includes('contacto.html')) {
        setupSearch();
    }

    // Configurar validación en la página de contacto
    if (paginaActual.includes('contacto.html')) {
        FormValidacion();
    }
});
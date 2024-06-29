// Constante para completar la ruta de la API.
const PRODUCTO_API = 'services/public/productos.php';
const MENU = document.getElementById('menu');
const TITULO = document.getElementById('titulo');

document.addEventListener('DOMContentLoaded', async () => {
    loadMenu();
    const HOUR = new Date().getHours();
    // Se define una variable para guardar un saludo.
    let greeting = '';
    // Dependiendo del número de horas transcurridas en el día, se asigna un saludo para el usuario.
    if (HOUR >= 6 || HOUR < 11) {
        greeting = '- Desayuno';
    } else if (HOUR >=11  || HOUR < 15) {
        greeting = '- Almuerzo';
    } else if (HOUR >= 15 || HOUR < 18) {
        greeting = '- Típico';
    }else if (HOUR >= 18 || HOUR < 22) {
        greeting = '- Cena';
    }
    TITULO.textContent = `Menu ${greeting}`;

});

/*
*   Función asíncrona para mostrar un gráfico de barras con la cantidad de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const loadMenu = async () => {
    const FORM = new FormData();
    FORM.append('producto', '');
    // Función fetchData que ya tienes programada
    const DATA = await fetchData(PRODUCTO_API, 'searchProductos', FORM);
    // Función para crear el HTML de un producto
    const crearProductoHTML = (producto) => {
        return `
            <div class="producto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p><strong>${producto.precio}</strong></p>
            </div>
        `;
    };

    // Insertar los productos en el menú
    if (DATA && DATA.dataset.productos) {
        DATA.dataset.productos.forEach(producto => {
            MENU.innerHTML += crearProductoHTML(producto);
        });
    } else {
        MENU.innerHTML = '<p>No hay productos disponibles.</p>';
    }
}

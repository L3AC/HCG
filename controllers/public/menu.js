const PRODUCTO_API = 'services/public/productos.php';
const MENU = document.getElementById('menu');
const TITULO = document.getElementById('titulo');

document.addEventListener('DOMContentLoaded', async () => {
    loadMenu();
    const HOUR = new Date().getHours();
    let greeting = '';

    if (HOUR >= 6 &&  HOUR < 11) {
        greeting = '- Desayuno';
    } else if (HOUR >=11  && HOUR < 15) {
        greeting = '- Almuerzo';
    } else if (HOUR >= 15 && HOUR < 18) {
        greeting = '- Típico';
    } else if (HOUR >= 18 && HOUR < 22) {
        greeting = '- Cena';
    }
    TITULO.textContent = `Menú ${greeting}`;
});

const loadMenu = async () => {
    const FORM = new FormData();
    FORM.append('producto', '');
    const DATA = await fetchData(PRODUCTO_API, 'searchProductos', FORM);

    const crearProductoHTML = (producto) => {
        return `
            <div class="producto">
                <img src="${producto.imagen_producto}" alt="${producto.descripcion_producto}">
                <h3>${producto.descripcion_producto}</h3>
                <p><strong>${producto.precio_producto}</strong></p>
            </div>
        `;
    };

    if (DATA && DATA.dataset.conjunto) {
        console.log(DATA.dataset.conjunto);
        DATA.dataset.conjunto.forEach(producto => {
            MENU.innerHTML += crearProductoHTML(producto);
        });
    } else {
        MENU.innerHTML = '<p>No hay productos disponibles.</p>';
    }
}
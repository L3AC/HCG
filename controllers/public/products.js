// Constante para completar la ruta de la API.
const PRODUCTO_API = 'services/public/producto.php';
// Constante tipo objeto para obtener los parámetros disponibles en la URL.
const PARAMS = new URLSearchParams(location.search);
const PRODUCTOS = document.getElementById('productos');

// Método manejador de eventos para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    action="";
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se define un objeto con los datos de la categoría seleccionada.
    const FORM = new FormData();

    if (PARAMS.has('id')) {
        FORM.append('idCategoria', PARAMS.get('id'));
        MAIN_TITLE.textContent = ` ${PARAMS.get('nombre')}`;
        action='readProductosCategoria';
        console.log(2);
    }
    if (PARAMS.has('modelo')) {
        FORM.append('modelo', PARAMS.get('modelo'));
        action='searchModelos';
        console.log(1);
    }
    // Petición para solicitar los productos de la categoría seleccionada.
    const DATA = await fetchData(PRODUCTO_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializa el contenedor de productos.
        PRODUCTOS.innerHTML = '';
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las tarjetas con los datos de cada producto.
            PRODUCTOS.innerHTML += `
            <div class="d-flex justify-content-center col-md-3 col-sm-6 mb-4">
            <div class="card hadow">
                <div class="text-center">
                <a href="detail.html?id=${row.id_modelo}">
                    <img src="${SERVER_URL}images/modelos/${row.foto_modelo}" class="img img-fluid img-hover" style="height: 220px; width: 260px;" alt="${row.descripcion_modelo}">
                    </a>
                </div>
                <div class="card-body">
                    <h5 class="card-title title ew-truncate">${row.descripcion_modelo}</h5>
                    <p class="card-text marca ew-truncate">${row.marca}</p>
                    <div class="d-grid gap-2 mmm">
                        <a href="detail.html?id=${row.id_modelo}" class="btn90">
                            <span class="text">Comprar</span>
                            <span>Adquirir!</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
            `;
        });
    } else {
        // Se presenta un mensaje de error cuando no existen datos para mostrar.
        MAIN_TITLE.textContent = DATA.error;
    }
});
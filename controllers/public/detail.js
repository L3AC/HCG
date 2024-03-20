// Constantes para completar la ruta de la API.
const PRODUCTO_API = 'services/public/producto.php',
    PEDIDO_API = 'services/public/pedido.php',
    MODELOTALLAS_API = 'services/public/modelotallas.php',
    COMENTARIOS_API = 'services/public/comentario.php';
// Constante tipo objeto para obtener los parámetros disponibles en la URL.
const PARAMS = new URLSearchParams(location.search);
// Constante para establecer el formulario de agregar un producto al carrito de compras.
const TALLAS = document.getElementById('tallas'),
    ID_MODELO = document.getElementById('idModelo'),
    IMAGEN_MODELO = document.getElementById('imagenModelo'),
    STOCK_MODELO = document.getElementById('stockModelo'),
    NOMBRE_MODELO = document.getElementById('nombreModelo');

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    BTNCOMENTARIO = document.getElementById('btnComentario'),
    ID_MODELO_TALLA = document.getElementById('idModeloTalla'),
    CANTIDAD = document.getElementById('cantidadModelo'),
    STOCK_INFO = document.getElementById('stock'),
    mensajeDiv = document.getElementById('mensajeDiv'),
    IDGUARDAR = document.getElementById('idGuardar');

const SAVE_MODAL2 = new bootstrap.Modal('#saveModal2'),
    MODAL_TITLE2 = document.getElementById('modalTitle2');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM2 = document.getElementById('saveForm2'),
    ADDCOMENTARIO = document.getElementById('addComentario'),
    LISTCOMENTARIO = document.getElementById('listComentario');

// Método del eventos para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'Modelo';
    // Constante tipo objeto con los datos del producto seleccionado.
    const FORM = new FormData();
    FORM.append('idProducto', PARAMS.get('id'));
    // Petición para solicitar los datos del producto seleccionado.
    const DATA = await fetchData(PRODUCTO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se colocan los datos en la página web de acuerdo con el producto seleccionado previamente.
        IMAGEN_MODELO.src = SERVER_URL.concat('images/modelos/', DATA.dataset.foto_modelo);
        NOMBRE_MODELO.textContent = DATA.dataset.descripcion_modelo;
        ID_MODELO.value = DATA.dataset.id_modelo;
        BTNCOMENTARIO.innerHTML =
            `<button type="button" class="btn btn-warning" onclick="openComentario(${PARAMS.get('id')})">
            <i class="bi bi-chat-dots"></i> Comentarios
        </button> `;

        const FORM2 = new FormData();
        FORM2.append('idModelo', ID_MODELO.value);
        const DATA2 = await fetchData(MODELOTALLAS_API, 'readAllActive', FORM2);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA2.status) {
            // Se inicializa el contenedor de productos.
            TALLAS.innerHTML = '';
            // Se recorre el conjunto de registros fila por fila a través del objeto row.
            DATA2.dataset.forEach(row => {
                // Se crean y concatenan las tarjetas con los datos de cada producto.
                TALLAS.innerHTML += `
                    <div class="col-4 " 
                    onclick="openModal(${row.id_modelo_talla})">
                    <div class="container d-flex justify-content-center">
                        <div class="contenedor-botones">
                            <button class="boton-numero ">
                                ${row.talla}
                                <div class="precio" style="font-weight: bold; opacity: 50%;
                                font-size: 14px;">$${row.precio_modelo_talla}</div>
                            </button>
                            <!-- ... -->
                        </div>
                        </div>
                    </div>
`;
            });
        } else {
            // Se presenta un mensaje de error cuando no existen datos para mostrar.
            MAIN_TITLE.textContent = DATA.error;
        }

    } else {
        // Se presenta un mensaje de error cuando no existen datos para mostrar.
        document.getElementById('mainTitle').textContent = DATA.error;
        // Se limpia el contenido cuando no hay datos para mostrar.
        document.getElementById('detalle').innerHTML = '';
    }
});
CANTIDAD.addEventListener('input', async function () {
    const FORM = new FormData();
    FORM.append('idModeloTalla', ID_MODELO_TALLA.value);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(MODELOTALLAS_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status === 1) {
        const ROW = DATA.dataset;
        if (CANTIDAD.value > ROW.stock_modelo_talla) {
            mensajeDiv.textContent = 'No puede escoger mas del stock';
            mensajeDiv.style.display = 'block';
            IDGUARDAR.disabled = true;
        }
        else if (CANTIDAD.value <= 0 || CANTIDAD.value > 3) {
            mensajeDiv.textContent = 'Solo puede escoger 3 existencias a la vez';
            mensajeDiv.style.display = 'block';
            IDGUARDAR.disabled = true;
        }
        else {
            mensajeDiv.textContent = "";
            IDGUARDAR.disabled = false;
        }
    }
});
/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openModal = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idModeloTalla', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(MODELOTALLAS_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Agregar al carrito';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_MODELO_TALLA.value = ROW.id_modelo_talla;
        STOCK_INFO.textContent = 'Existencias disponibles ' + ROW.stock_modelo_talla;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}
const openComentario = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idModelo', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(COMENTARIOS_API, 'readAllActive', FORM);
    LISTCOMENTARIO.innerHTML = ``;
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL2.show();
        DATA.dataset.forEach(row => {
            // Se crea y concatena la fila de la tabla con los datos de cada registro.
            let comentario = `
                <li class="list-group-item">
                    <div class="row">
                        <div class="col-md-8">
                            <h5>${row.cliente}</h5>
                        </div>
                        <div class="col-md-4">
                            <div class="rating rating-${row.id_comentario}">
                                <input type="radio" id="star-1-${row.id_comentario}" name="star-radio-${row.id_comentario}" value="1" data-rating="1">
                                <label for="star-1-${row.id_comentario}">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                </label>
                                <input type="radio" id="star-2-${row.id_comentario}" name="star-radio-${row.id_comentario}" value="2" data-rating="2">
                                <label for="star-2-${row.id_comentario}">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                </label>
                                <input type="radio" id="star-3-${row.id_comentario}" name="star-radio-${row.id_comentario}" value="3" data-rating="3">
                                <label for="star-3-${row.id_comentario}">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                </label>
                                <input type="radio" id="star-4-${row.id_comentario}" name="star-radio-${row.id_comentario}" value="4" data-rating="4">
                                <label for="star-4-${row.id_comentario}">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                </label>
                                <input type="radio" id="star-5-${row.id_comentario}" name="star-radio-${row.id_comentario}" value="5" data-rating="5">
                                <label for="star-5-${row.id_comentario}">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <textarea class="form-control" style="resize: none;">${row.contenido_comentario}</textarea>
                        </div>
                    </div>
                    <p class="mt-2">${row.fecha_comentario}</p>
                </li>
            `;
            LISTCOMENTARIO.insertAdjacentHTML('beforeend', comentario);
        
            let ratingValue = parseInt(row.puntuacion_comentario);
            let stars = document.querySelectorAll(`.rating-${row.id_comentario} input[type="radio"]`);
        
            stars.forEach((star, index) => {
                if (index < 6-ratingValue) {
                    star.checked = true;
                } else {
                    star.checked = false;
                }
            });
        });
              
        
        document.querySelectorAll('.rating input[type="radio"], .rating label').forEach(function (element) {
            element.disabled = true;
        });
    } else {
        sweetAlert(4, DATA.error, false);
    }
}


// Método del evento para cuando se envía el formulario de agregar un producto al carrito.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(PEDIDO_API, 'createDetail', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se constata si el cliente ha iniciado sesión.
    if (DATA.status) {
        sweetAlert(1, DATA.message, false, 'cart.html');
    } else if (DATA.session) {
        sweetAlert(2, DATA.error, false);
    } else {
        sweetAlert(3, DATA.error, true, 'login.html');
    }
});
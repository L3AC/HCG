// Constantes para completar las rutas de la API.
const PRODUCTO_API = 'services/admin/2modelos.php',
    MARCA_API = 'services/admin/1marcas.php',
    TALLA_API = 'services/admin/3tallas.php',
    MODELOTALLAS_API = 'services/admin/11modelotallas.php';
// Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm'),
    SEARCHSUB_FORM = document.getElementById('searchsubForm');
// Constantes para establecer el contenido de la tabla.
const SUBTABLE_HEAD = document.getElementById('subheaderT'),
    SUBTABLE = document.getElementById('subtable'),
    SUBTABLE_BODY = document.getElementById('subtableBody'),
    TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound'),
    SUBROWS_FOUND = document.getElementById('subrowsFound');
// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle'),
    SUBMODAL_TITLE = document.getElementById('submodalTitle');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_PRODUCTO = document.getElementById('idModelo'),
    NOMBRE_PRODUCTO = document.getElementById('nombreModelo'),
    DESCRIPCION_PRODUCTO = document.getElementById('descripcionProducto'),
    PRECIO_PRODUCTO = document.getElementById('precioProducto'),
    EXISTENCIAS_PRODUCTO = document.getElementById('existenciasProducto'),
    ESTADO_PRODUCTO = document.getElementById('estadoModelo');
IMAGEN_PRODUCTO = document.getElementById('imagenModelo'),
    IMAGEN_PRE = document.getElementById('imgPre');

// Constantes para establecer los elementos del formulario de modelo tallas de guardar.
const SAVE_TREMODAL = new bootstrap.Modal('#savetreModal'),
    TREMODAL_TITLE = document.getElementById('tremodalTitle');
const SAVE_TREFORM = document.getElementById('savetreForm'),
    SELECTALLA = document.getElementById('selectTalla'),
    ID_MODELOTALLA = document.getElementById('idModeloTalla'),
    PRECIO_MODELOTALLA = document.getElementById('precioModeloTalla'),
    STOCK_MODELOTALLA = document.getElementById('stockModeloTalla');

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'Gestionar modelos';
    // Llamada a la función para llenar la tabla con los registros existentes.
    fillTable();
});

// Método del evento para cuando se envía el formulario de buscar.
SEARCH_FORM.addEventListener('submit', (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SEARCH_FORM);
    // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
    fillTable(FORM);
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_PRODUCTO.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(PRODUCTO_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        ID_PRODUCTO.value = null;
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(PRODUCTO_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            console.log(DATA.dataset);
            // Se establece un icono para el estado del producto.
            (row.estado_modelo) ? icon = 'bi bi-eye-fill' : icon = 'bi bi-eye-slash-fill';
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <tr>
                    <td><img src="${SERVER_URL}images/modelos/${row.foto_modelo}" height="50"></td>
                    <td>${row.descripcion_modelo}</td>
                    <td>${row.marca}</td>
                    <td><i class="${icon}"></i></td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="openUpdate(${row.id_modelo})">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDelete(${row.id_modelo})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    IMAGEN_PRE.innerHTML = '';
    MODAL_TITLE.textContent = 'Crear registro';
    SUBTABLE.hidden = true;

    // Se prepara el formulario.
    SAVE_FORM.reset();
    //EXISTENCIAS_PRODUCTO.disabled = false;
    fillSelect(MARCA_API, 'readAll', 'marcaModelo');
}

IMAGEN_PRODUCTO.addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        imgPre.innerHTML = '';
        imgPre.appendChild(img);
        // Establecer los estilos CSS de la imagen
        img.style.maxWidth = '300px';
        img.style.maxHeight = 'auto';
        img.style.margin = '20px auto';
    };
    reader.readAsDataURL(file);
});

// Agregar un evento click a la imagen para aplicar un zoom
IMAGEN_PRE.addEventListener('click', function () {
    IMAGEN_PRE.style.transform = 'scale(3)'; /* Escala de 1.5 (ampliar al 150% del tamaño original) al hacer clic en la imagen */
    event.stopPropagation(); 
});

document.addEventListener('click', function() {
    IMAGEN_PRE.style.transform = 'scale(1)'; /* Restablecer el tamaño original de la imagen */
});

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idModelo', id);
    
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(PRODUCTO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        SUBTABLE.hidden = false;
        MODAL_TITLE.textContent = 'Actualizar registro';
        SUBMODAL_TITLE.textContent = 'Tallas del modelo';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_PRODUCTO.value = ROW.id_modelo;
        NOMBRE_PRODUCTO.value = ROW.descripcion_modelo;
        ESTADO_PRODUCTO.checked = ROW.estado_modelo;
        IMAGEN_PRE.style.maxWidth = '300px';
        IMAGEN_PRE.style.maxHeight = 'auto';
        IMAGEN_PRE.style.margin = '20px auto';
        IMAGEN_PRE.innerHTML = '';
        IMAGEN_PRE.insertAdjacentHTML(
            "beforeend",
            `<img src="${SERVER_URL}images/modelos/${ROW.foto_modelo}">` // Backticks para img variable
        );

        fillSelect(MARCA_API, 'readAll', 'marcaModelo', ROW.id_marca);
        fillsubTable(SEARCHSUB_FORM);
    } else {
        sweetAlert(2, DATA.error, false);
    }
}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea inactivar el producto de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idModelo', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(PRODUCTO_API, 'deleteRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillTable();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}
/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillsubTable = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    SUBROWS_FOUND.textContent = '';
    SUBTABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(MODELOTALLAS_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            SUBTABLE_BODY.innerHTML += `
                <tr>
                    <td>${row.talla}</td>
                    <td>${row.stock_modelo_talla}</td>
                    <td>$ ${row.precio_modelo_talla}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="opensubUpdate(${row.id_modelo_talla})">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="opensubDelete(${row.id_modelo_talla})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        SUBROWS_FOUND.textContent = DATA.message;
    } else {
        //sweetAlert(4, DATA.error, true);
    }
}
const subclose = () => {
    SAVE_MODAL.show();
}

const opensubCreate = () => {
    SAVE_MODAL.hide();
    SAVE_TREMODAL.show();
    SELECTALLA.hidden = false;
    //SAVE_MODAL.hidden = false;
    TREMODAL_TITLE.textContent = 'Agregar talla';
    // Se prepara el formulario.
    SAVE_TREFORM.reset();
    //EXISTENCIAS_PRODUCTO.disabled = false;
    fillSelect(TALLA_API, 'readAll', 'tallaModeloTalla');
}

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const opensubUpdate = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    SAVE_MODAL.hide();
    SELECTALLA.hidden = true;
    const FORM = new FormData();
    FORM.append('idModeloTalla', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(MODELOTALLAS_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_TREMODAL.show();
        TREMODAL_TITLE.textContent = 'Tallas del modelo';
        // Se prepara el formulario.
        SAVE_TREFORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_MODELOTALLA.value = ROW.id_modelo_talla;
        console.log(ROW.stock + ' ' + ROW.precio_modelo_talla);
        STOCK_MODELOTALLA.value = ROW.stock_modelo_talla;
        PRECIO_MODELOTALLA.value = ROW.precio_modelo_talla;

    } else {
        sweetAlert(2, DATA.error, false);
    }
}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const opensubDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea inactivar el producto de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idModelo', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(PRODUCTO_API, 'deleteRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillTable();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}


/*
*   Función para abrir un reporte automático de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openReport = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/admin/productos.php`);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}
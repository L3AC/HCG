// Constantes para completar las rutas de la API.
const CRUD_API = 'services/admin/tipoitems.php';
// Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');
// Constantes para establecer el contenido de la tabla.
const SUBTABLE_HEAD = document.getElementById('subheaderT'),
    SUBTABLE_BODY = document.getElementById('subtableBody'),
    TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound'),
    SUBROWS_FOUND = document.getElementById('subrowsFound');
// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle'),
    INPUTSEARCH = document.getElementById('inputsearch'),
    SUBMODAL_TITLE = document.getElementById('submodalTitle');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_PRODUCTO = document.getElementById('idTipoItem'),
    NOMBRE_PRODUCTO = document.getElementById('nombreTipoItem'),
    ESTADO_PRODUCTO = document.getElementById('estadoTipoItem');
//Variable para poner un tiempo de espera
let timeout_id;

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'Gestionar tipo items';
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
    const DATA = await fetchData(CRUD_API, action, FORM);
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
INPUTSEARCH.addEventListener('input', function () {
    clearTimeout(timeout_id);
    timeout_id = setTimeout(async function () {
        fillTable();
    }, 50); // Delay de 50ms
});
//Función asíncrona para llenar la tabla con los registros disponibles.
const fillTable = async () => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    const FORM = new FormData();
    FORM.append('valor', INPUTSEARCH.value);
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(CRUD_API, 'searchRows', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del producto.
            (row.estado_tipo_item) ? icon = 'bi bi-eye-fill' : icon = 'bi bi-eye-slash-fill';
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
            <div class="cardlar row" style="margin-bottom: 10px; margin-left: auto; margin-right: auto;">
                <div class="col-lg-6 col-md-12" style="display: flex; align-items: center;"><div class="texto-antes">Item:</div>${row.descripcion_tipo_item}</div>
                    <div class="col-lg-2 col-md-12" style="display: flex; align-items: center; font-size: 20px;"><div class="texto-antes">Estado:</div><i  class="${icon}"></i></div>
                    <div class="col-lg-4 col-md-12 col-sm-12 d-flex justify-content-end">
                        <button type="button" title="Detalle pedido" class="btnAgregar btnMargin"  style="width: 55%; margin-top: 5px; margin-bottom: 5px;" onclick="openUpdate(${row.id_tipo_item})">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button type="button" title="Eliminar pedido" class="btnAgregar" style="width: 55%; margin-top: 5px; margin-bottom: 5px;" onclick="openDelete(${row.id_tipo_item})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                        <button type="button" title="Reporte item" class="btnAgregar" style="width: 55%; margin-top: 5px; margin-bottom: 5px;" onclick="openReportParam(${row.id_tipo_item})">
                            <i class="bi bi-file-earmark-text-fill"></i>
                        </button>
                    </div>     
            </div>
                    
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        //sweetAlert(4, DATA.error, true);
    }
}

//Función para preparar el formulario al momento de insertar un registro.
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear registro';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}

//Función asíncrona para preparar el formulario al momento de actualizar un registro.
const openUpdate = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idTipoItem', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(CRUD_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar registro';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        //EXISTENCIAS_PRODUCTO.disabled = true;
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_PRODUCTO.value = ROW.id_tipo_item;
        NOMBRE_PRODUCTO.value = ROW.descripcion_tipo_item;
        ESTADO_PRODUCTO.checked = ROW.estado_tipo_item;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

//Función asíncrona para eliminar un registro.
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el tipo item?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idTipoItem', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(CRUD_API, 'deleteRow', FORM);
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

//Función para abrir un reporte automático de un regristo.
const openReport = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/admin/3tallas.php`);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}

const openItemsTipoIReport = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/admin/tipo_items.php`);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}

/*
*   Función para abrir un reporte parametrizado.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openReportParam = (id) => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/admin/productos_tipo_item.php`);
    // Se agrega un parámetro a la ruta con el valor del registro seleccionado.
    PATH.searchParams.append('idTipoItem', id);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}
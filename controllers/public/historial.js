const PEDIDO_API = 'services/public/pedidos.php',
    DETALLEPEDIDO_API = 'services/public/detallepedidos.php',
    PHPMAILER_API = 'libraries/PHPMailer.php',
    SENDCODE_API = 'libraries/sendCode.php';;
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
    DETALLE_MODAL = new bootstrap.Modal('#detalleModal'),
    MODAL_TITLE = document.getElementById('modalTitle'),
    SUBMODAL_TITLE = document.getElementById('submodalTitle');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    DETALLE_FORM = document.getElementById('detalleForm'),
    INPUTSEARCH = document.getElementById('inputsearch'),
    //SUBINPUTSEARCH = document.getElementById('subinputsearch'),
    ID_PEDIDO = document.getElementById('idPedido'),
    CLIENTE_PEDIDO = document.getElementById('clientePedido'),
    NOTA_PEDIDO = document.getElementById('notaPedido'),
    CODIGO_PEDIDO = document.getElementById('codigoPedido'),
    FECHA_PEDIDO = document.getElementById('fechaPedido'),
    ESTADO_PEDIDO = document.getElementById('estadoPedido');
let ESTADO_BUSQUEDA = "Pendiente";
//Variable para poner un tiempo de espera
let timeout_id;

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'Pedidos';
    // Llamada a la función para llenar la tabla con los registros existentes.
    fillTable(ESTADO_BUSQUEDA);
});

// Método del evento para cuando se envía el formulario de buscar.
SEARCH_FORM.addEventListener('submit', (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SEARCH_FORM);
    // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
    fillTable(ESTADO_BUSQUEDA);
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_PEDIDO.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(PEDIDO_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        ID_PEDIDO.value = null;
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable(ESTADO_BUSQUEDA);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});
/*BUSQUEDA EN TIEMPO REAL*/
INPUTSEARCH.addEventListener('input', async function () {
    fillTable(ESTADO_BUSQUEDA);
});

//Función asíncrona para llenar la tabla con los registros disponibles.
const fillTable = async (estado=null) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '0 coincidencias';
    TABLE_BODY.innerHTML = '';
    ESTADO_BUSQUEDA=estado;
    // Se verifica la acción a realizar.
    const FORM = new FormData();
    FORM.append('valor', INPUTSEARCH.value);
    FORM.append('estado',estado);
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(PEDIDO_API, 'searchByCliente', FORM);
    /*(form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(PEDIDO_API, action, form);*/
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            if (row.estado_pedido == 'Pendiente') {
                const rowHTML = `
                <div class="cardlard row" style="margin-bottom: 10px; margin-left: auto; margin-right: auto;">
                    <div class="col-lg-4 col-md-12 col-sm-12 justify-content-center" style="font-size: 17px;"><div class="texto-antes">Código: </div>${row.codigo_pedido}</div>
                    <div class="col-lg-3 col-md-12 col-sm-12" style="display: flex; align-items: center; font-size: 17px;"><div class="texto-antes">Fecha: </div>${row.fecha}</div>
                    <div class="col-lg-2 col-md-12 col-sm-12" style="display: flex; align-items: center; font-size: 17px;"><div class="texto-antes">Estado: </div>${row.estado_pedido}</div>
                    <div class="col-lg-3 col-md-12 col-sm-12 d-flex justify-content-end">
                        <button type="button" title="Detalle pedido" class="btnAgregar"  style="width: 55%; margin-top: 5px; margin-bottom: 5px;" onclick="openUpdate(${row.id_pedido})">
                            <i class="bi bi-info-circle" ></i>
                        </button>
                    </div>
                </tr>
            `;
            TABLE_BODY.innerHTML += rowHTML;
            } else {
                const rowHTML = `
                <div class="cardlard row" style="margin-bottom: 10px; margin-left: auto; margin-right: auto;">
                    <div class="col-lg-4 col-md-12 col-sm-12 d-flex justify-content-center align-items-center" style=" font-size: 17px;"><div class="texto-antes">Código: </div>${row.codigo_pedido}</div>
                    <div class="col-lg-3 col-md-12 col-sm-12 justify-content-center" style="display: flex; align-items: center; font-size: 17px;"><div class="texto-antes">Fecha: </div>${row.fecha}</div>
                    <div class="col-lg-2 col-md-12 col-sm-12 justify-content-center" style="display: flex; align-items: center; font-size: 17px;"><div class="texto-antes">Estado: </div>${row.estado_pedido}</div>
                    <div class="col-lg-2 col-md-12 col-sm-12 d-flex justify-content-end">
                        <button type="button" title="Detalle pedido" class="btnAgregar"  style="width: 55%; margin-top: 5px; margin-bottom: 5px;" onclick="openUpdate(${row.id_pedido})">
                            <i class="bi bi-info-circle" ></i>
                        </button>
                    </div>
                </div>
                `;
                TABLE_BODY.innerHTML += rowHTML;
            }
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        //sweetAlert(4, 'No se encontraron resultados', false);
    }
}




//Función asíncrona para preparar el formulario al momento de actualizar un registro.
const openUpdate = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idPedido', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(PEDIDO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        SUBTABLE.hidden = false;
        MODAL_TITLE.textContent = 'Información del pedido';
        SUBMODAL_TITLE.textContent = 'Detalle del pedido';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        CLIENTE_PEDIDO.disabled = true;
        FECHA_PEDIDO.disabled = true;
        ESTADO_PEDIDO.disabled = true;
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_PEDIDO.value = ROW.id_pedido;
        CLIENTE_PEDIDO.value = ROW.cliente;
        FECHA_PEDIDO.value = ROW.fecha;
        ESTADO_PEDIDO.value = ROW.estado_pedido;
        CODIGO_PEDIDO.value = ROW.codigo_pedido;

        fillSubTable(SEARCHSUB_FORM);
    } else {
        sweetAlert(2, DATA.error, false);
    }
}
/*SUBINPUTSEARCH.addEventListener('input', async function () {
    fillSubTable();
});*/
//Función asíncrona para eliminar un registro.

//Función asíncrona para llenar la tabla con los registros disponibles.
const fillSubTable = async () => {
    SUBROWS_FOUND.textContent = '';
    SUBTABLE_BODY.innerHTML = '';
    const FORM = new FormData();
    //FORM.append('valor', SUBINPUTSEARCH.value ?? null);
    FORM.append('idPedido', ID_PEDIDO.value ?? null);
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(DETALLEPEDIDO_API, 'searchByPedido', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se verifica si la nota_pedido no es "Vacío" antes de agregar la fila a la tabla.
            if (row.nota_pedido !== 'Nota vacía') {
                // Se crea y concatena la fila de la tabla con los datos de cada registro, incluyendo el botón.
                const rowHTML = `
                    <tr ">
                    <td class="text-center"><img src="${row.imagen_producto}" height="70" width="100"></td>
                    <td >${row.descripcion_producto}</td>
                    <td class="text-center">${row.cantidad_pedido}</td>
                    <td>$ ${row.precio_producto}</td>
                    <td>$ ${row.subtotal}</td>
                    <td>
                        <button type="button" title="Existe una nota" class="btn btn-danger"  style="width: 75%;
                        margin-top: 5px; margin-bottom: 5px;" onclick="opensubUpdate(${row.id_detalle_pedido})">
                            <i class="bi bi-app-indicator"></i>
                        </button>
                    </td>
                    </tr>
                `;
                SUBTABLE_BODY.innerHTML += rowHTML;
            } else {
                // Si la nota_pedido es "Vacío", se crea y concatena la fila de la tabla sin el botón.
                const rowHTML = `
                    <tr">
                    <td class="text-center"><img src="${row.imagen_producto}" height="70" width="100"></td>
                    <td>${row.descripcion_producto}</td>
                    <td class="text-center">${row.cantidad_pedido}</td>
                    <td>$ ${row.precio_producto}</td>
                    <td>$ ${row.subtotal}</td>
                    <td></td>
                    </tr>
                `;
                SUBTABLE_BODY.innerHTML += rowHTML;
            }
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        SUBROWS_FOUND.textContent = DATA.message;
    } else {
        // sweetAlert(4, DATA.error, true);
    }
}

const subClose = () => {
    SAVE_MODAL.show();
}
const opensubUpdate = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    SAVE_MODAL.hide();
    const FORM = new FormData();
    FORM.append('idDetallePedido', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(DETALLEPEDIDO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        DETALLE_MODAL.show();
        // Se prepara el formulario.
        DETALLE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        NOTA_PEDIDO.value = ROW.nota_pedido;

    } else {
        sweetAlert(2, DATA.error, false);
    }
}

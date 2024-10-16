// Constantes para completar las rutas de la API.
const ROL_API = 'services/admin/roles.php';
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
    SUBMODAL_TITLE = document.getElementById('submodalTitle');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    INPUTSEARCH = document.getElementById('inputsearch'),
    ID_ROL = document.getElementById('idRol'),
    NOMBRE_OPC = document.getElementById('nombreRol'),
    ESTADO_ROL = document.getElementById('estadoRol'),
    PRODUCTO_OPC = document.getElementById('estadoProducto'),
    PEDIDO_OPC = document.getElementById('estadoPedido'),
    TIPOITEM_OPC = document.getElementById('estadoTipoItem'),
    ITEM_OPC = document.getElementById('estadoItem'),
    CLIENTE_OPC = document.getElementById('estadoCliente'),
    USUARIO_OPC = document.getElementById('estadoUsuario'),
    ROL_OPC = document.getElementById('estadoRol');
//Variable para poner un tiempo de espera
let timeout_id;


// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'Gestionar roles';
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
    (ID_ROL.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(ROL_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        ID_ROL.value = null;
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});
/*BUSQUEDA EN TIEMPO REAL*/
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
    const FORM = new FormData();
    FORM.append('valor', INPUTSEARCH.value);
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(ROL_API, 'searchRows', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del ROL.
            (row.estado_rol) ? icon = 'bi bi-eye-fill ' : icon = 'bi bi-eye-slash-fill';
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
            <div class="cardlar row" style="margin-bottom: 10px; margin-left: auto; margin-right: auto; width= 50%;">
                <div class="col-lg-6 col-md-12 col-sm-12" style="display: flex; align-items: center; font-size: 17px;"><div class="texto-antes">descripcion: </div>${row.descripcion_rol}</div>
                <div class="col-lg-2 col-md-12 col-sm-12" style="display: flex; align-items: center;font-size: 30px;"><div class="texto-antes" style="font-size: 17px;">Estado: </div><i  class="${icon}"></i></div>
                <div class="col-lg-4 col-md-12 col-sm-12 d-flex justify-content-end">
                    <button type="button" title="Detalle pedido" class="btnAgregar btnMargin"  style="width: 55%; margin-top: 5px; margin-bottom: 5px;" onclick="openUpdate(${row.id_rol})">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button type="button" title="Eliminar pedido" class="btnAgregar" style="width: 55%; margin-top: 5px; margin-bottom: 5px;" onclick="openDelete(${row.id_rol})">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </div>  
            </div>
        
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
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
    FORM.append('idRol', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(ROL_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar registro';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        //EXISTENCIAS_ROL.disabled = true;
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_ROL.value = ROW.id_rol;
        ID_ROL.value = ROW.id_rol;
        NOMBRE_OPC.value = ROW.descripcion_rol;
        ESTADO_ROL.checked = ROW.estado_rol === "1";
        PRODUCTO_OPC.checked = ROW.productos_opc === "1";
        PEDIDO_OPC.checked = ROW.pedidos_opc === "1";
        TIPOITEM_OPC.checked = ROW.tipo_items_opc === "1";
        ITEM_OPC.checked = ROW.items_opc === "1";
        CLIENTE_OPC.checked = ROW.clientes_opc === "1";
        USUARIO_OPC.checked = ROW.usuarios_opc === "1";
        


    } else {
        sweetAlert(2, DATA.error, false);
    }
}

//Función asíncrona para eliminar un registro.
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el rol?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idRol', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(ROL_API, 'deleteRow', FORM);
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
*   Función para abrir un reporte automático de ROLs por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openReport = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/admin/3ROLs.php`);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}
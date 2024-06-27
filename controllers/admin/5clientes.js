// Constante para completar la ruta de la API.
const CLIENTE_API = 'services/admin/clientes.php';
// Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');
// Constantes para establecer los elementos de la tabla.
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    INPUTSEARCH = document.getElementById('inputsearch'),
    ID_CLIENTE = document.getElementById('idCliente'),
    NOMBRE_CLIENTE = document.getElementById('nombreCliente'),
    APELLIDO_CLIENTE = document.getElementById('apellidoCliente'),
    TEL_CLIENTE = document.getElementById('telefonoCliente'),
    CORREO_CLIENTE = document.getElementById('correoCliente'),
    ESTADO_CLIENTE = document.getElementById('estadoCliente'),
    ALIAS_CLIENTE = document.getElementById('aliasCliente'),
    CLAVE_CLIENTE = document.getElementById('claveCliente'),
    CONFIRMAR_CLAVE = document.getElementById('confirmarClave'),
    DIV_ALIAS = document.getElementById('divAlias'),
    DIV_CLAVE = document.getElementById('divClave'),
    DIV_CONFIRMAR = document.getElementById('divConfirmar');

const MENSAJE_DIV = document.getElementById('MENSAJE_DIV'),
    IDGUARDAR = document.getElementById('idGuardar');

let new_correo = '';

vanillaTextMask.maskInput({
        inputElement: TEL_CLIENTE,
        mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
});

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'Gestionar clientes';
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
    (ID_CLIENTE.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    (ID_CLIENTE.value) ? FORM.append('correoClienteNew', new_correo) : FORM.append('n', 'n');
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(CLIENTE_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        ID_CLIENTE.value = null;
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});
INPUTSEARCH.addEventListener('input', async function () {
    fillTable();
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
    const DATA = await fetchData(CLIENTE_API, 'searchRows', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
             // Se establece un icono para el estado 
             (row.estado_cliente) ? icon = 'bi bi-eye-fill' : icon = 'bi bi-eye-slash-fill';
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
             <div class="cardlar row col-12" style="margin-bottom: 10px; margin-left: auto; margin-right: auto;">
            <div class="col-lg-2 col-md-12 col-sm-12" style="display: flex; align-items: center; font-size: 17px;"><div class="texto-antes">Apellido: </div>${row.apellido_cliente}</div>
            <div class="col-lg-2 col-md-12 col-sm-12" style="display: flex; align-items: center; font-size: 17px;"><div class="texto-antes">Nombre: </div>${row.nombre_cliente}</div>
            <div class="col-lg-2 col-md-12 col-sm-12" style="display: flex; align-items: center; font-size: 17px;"><div class="texto-antes">Teléfono: </div><div>${row.telefono_cliente}</div></div>
            <div class="col-lg-3 col-md-12 col-sm-12" style="display: flex; align-items: center; font-size: 17px;"><div class="texto-antes">Correo: </div>${row.correo_cliente}</div>

                <div class="col-lg-1 col-md-12 col-sm-12" style="display: flex; align-items: center;font-size: 30px;"><div class="texto-antes" style="font-size: 17px;">Estado: </div><i  class="${icon}"></i></div>
                <div class="col-lg-2 col-md-12 col-sm-12 d-flex justify-content-end">
                <button type="button" title="Detalle pedido" class="btnAgregar btnMargin"  
                style="width: 55%; margin-top: 5px; margin-bottom: 5px;" onclick="openUpdate(${row.id_cliente})">
                    <i class="bi bi-pencil-fill"></i>
                </button>
                <button type="button" title="Eliminar pedido" class="btnAgregar" 
                style="width: 55%; margin-top: 5px; margin-bottom: 5px;" onclick="openDelete(${row.id_cliente})">
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
    hideElements(false);
}
//Función asíncrona para preparar el formulario al momento de actualizar un registro.
const openUpdate = async (id) => {
    // Se define una constante tipo objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idCliente', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(CLIENTE_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar registro';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        hideElements(true);
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_CLIENTE.value = ROW.id_cliente;
        console.log(ID_CLIENTE.value);
        NOMBRE_CLIENTE.value = ROW.nombre_cliente;
        APELLIDO_CLIENTE.value = ROW.apellido_cliente;
        CORREO_CLIENTE.value = ROW.correo_cliente;
        new_correo = ROW.correo_cliente;
        TEL_CLIENTE.value = ROW.telefono_cliente;
        ALIAS_CLIENTE.value = ROW.usuario_cliente;
        ESTADO_CLIENTE.checked=ROW.estado_cliente;

    } else {
        sweetAlert(2, DATA.error, false);
    }
}
const hideElements= async(bool)=>{
    //DIV_ALIAS.hidden = bool;
    ALIAS_CLIENTE.disabled = bool;
    //DIV_CLAVE.hidden = bool;
    CLAVE_CLIENTE.disabled = bool;
    //DIV_CONFIRMAR.hidden = bool;
    CONFIRMAR_CLAVE.disabled = bool;
}

//Función asíncrona para eliminar un registro.
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el CLIENTE de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idCliente', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(CLIENTE_API, 'deleteRow', FORM);
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
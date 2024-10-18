
// Constante para completar la ruta de la API.
const USUARIO_API = 'services/admin/usuarios.php',
    ROL_API = 'services/admin/roles.php';
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
    ID_USUARIO = document.getElementById('idUsuario'),
    ROL_USUARIO = document.getElementById('rolUsuario'),
    NOMBRE_Usuario = document.getElementById('nombreUsuario'),
    APELLIDO_Usuario = document.getElementById('apellidoUsuario'),
    CORREO_Usuario = document.getElementById('correoUsuario'),
    ALIAS_Usuario = document.getElementById('aliasUsuario'),
    CLAVE_Usuario = document.getElementById('claveUsuario'),
    CONFIRMAR_CLAVE = document.getElementById('confirmarClave'),
    ESTADO_USUARIO = document.getElementById('estadoUsuario');
const mensajeDiv = document.getElementById('mensajeDiv'),
    IDGUARDAR = document.getElementById('idGuardar');

    let new_correo, timeout_id;

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'Gestionar usuarios';
    // Llamada a la función para llenar la tabla con los registros existentes.
    fillTable();
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_USUARIO.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    (ID_USUARIO.value) ? FORM.append('correoUsuarioNew', CORREO_Usuario.value) : FORM.append('n', 'n');
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(USUARIO_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        ID_USUARIO.value = null;
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

/*ALIAS_Usuario.addEventListener('input', async function () {
    const FORM = new FormData();
    FORM.append('usuario', ALIAS_Usuario.value);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(USUARIO_API, 'readExist', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status === 1) {
        mensajeDiv.textContent = 'Ya existe el usuario';
        mensajeDiv.style.display = 'block';
        IDGUARDAR.disabled = true;
    } else {
        mensajeDiv.textContent = "";
        IDGUARDAR.disabled = false;
    }
});*/
//Función asíncrona para llenar la tabla con los registros disponibles.
const fillTable = async () => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    const FORM = new FormData();
    FORM.append('valor', INPUTSEARCH.value);
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(USUARIO_API, 'searchRows', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            (row.estado_usuario) ? icon = 'bi bi-eye-fill' : icon = 'bi bi-eye-slash-fill';
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
            <div class="cardlar row col-12" style="margin-bottom: 10px; margin-left: auto; margin-right: auto;">
            <div class="col-lg-2 col-md-12 col-sm-12" style="display: flex; align-items: center; font-size: 17px;"><div class="texto-antes">Apellido: </div>${row.apellido_usuario}</div>
            <div class="col-lg-2 col-md-12 col-sm-12" style="display: flex; align-items: center; font-size: 17px;"><div class="texto-antes">Nombre: </div>${row.nombre_usuario}</div>
            <div class="col-lg-3 col-md-12 col-sm-12" style="display: flex; align-items: center; font-size: 17px;"><div class="texto-antes">Correo: </div>${row.email_usuario}</div>
            <div class="col-lg-2 col-md-12 col-sm-12" style="display: flex; align-items: center; font-size: 17px;">
                <div class="texto-antes">Usuario: </div>
                    <div>${row.alias_usuario}</div>
                </div>

                <div class="col-lg-1 col-md-12 col-sm-12" style="display: flex; align-items: center;font-size: 30px;"><div class="texto-antes" style="font-size: 17px;">Estado: </div><i  class="${icon}"></i></div>
                <div class="col-lg-2 col-md-12 col-sm-12 d-flex justify-content-end">
                <button type="button" title="Detalle pedido" class="btnAgregar btnMargin"  
                style="width: 55%; margin-top: 5px; margin-bottom: 5px;" onclick="openUpdate(${row.id_usuario})">
                    <i class="bi bi-pencil-fill"></i>
                </button>
                <button type="button" title="Eliminar pedido" class="btnAgregar" 
                style="width: 55%; margin-top: 5px; margin-bottom: 5px;" onclick="openDelete(${row.id_usuario})">
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
    MODAL_TITLE.textContent = 'Crear Usuario';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    ID_USUARIO.value = null;
    ALIAS_Usuario.disabled = false;
    CLAVE_Usuario.disabled = false;
    CONFIRMAR_CLAVE.disabled = false;
    fillSelect(ROL_API, 'fillSelect', 'rolUsuario');
}

//Función asíncrona para preparar el formulario al momento de actualizar un registro.
const openUpdate = async (id) => {
    // Se define una constante tipo objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idUsuario', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(USUARIO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar Usuario';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        ALIAS_Usuario.disabled = true;
        CLAVE_Usuario.disabled = true;
        CONFIRMAR_CLAVE.disabled = true;
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_USUARIO.value = ROW.id_usuario;
        NOMBRE_Usuario.value = ROW.nombre_usuario;
        APELLIDO_Usuario.value = ROW.apellido_usuario;
        CORREO_Usuario.value = ROW.email_usuario;
        new_correo = ROW.email_usuario;
        ALIAS_Usuario.value = ROW.alias_usuario;
        ESTADO_USUARIO.checked = ROW.estado_usuario;
        fillSelect(ROL_API, 'fillSelect', 'rolUsuario', ROW.id_rol);
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

//Función asíncrona para eliminar un registro.
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el usuario de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idUsuario', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(USUARIO_API, 'deleteRow', FORM);
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

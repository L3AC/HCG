// Constante para completar la ruta de la API.
const ADMINISTRADOR_API = 'services/admin/6usuarios.php',
    ROL_API = 'services/admin/7roles.php';
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
    ID_ADMINISTRADOR = document.getElementById('idAdministrador'),
    ROL_ADMINISTRADOR = document.getElementById('rolUsuario'),
    NOMBRE_ADMINISTRADOR = document.getElementById('nombreAdministrador'),
    APELLIDO_ADMINISTRADOR = document.getElementById('apellidoAdministrador'),
    CORREO_ADMINISTRADOR = document.getElementById('correoAdministrador'),
    ALIAS_ADMINISTRADOR = document.getElementById('aliasAdministrador'),
    CLAVE_ADMINISTRADOR = document.getElementById('claveAdministrador'),
    CONFIRMAR_CLAVE = document.getElementById('confirmarClave'),
    ESTADO_USUARIO = document.getElementById('estadoUsuario');
const mensajeDiv = document.getElementById('mensajeDiv'),
    IDGUARDAR = document.getElementById('idGuardar');

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'Gestionar usuarios';
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
    (ID_ADMINISTRADOR.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(ADMINISTRADOR_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        ID_ADMINISTRADOR.value = null;
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});
//METODO PARA BUSCAR 
INPUTSEARCH.addEventListener('input', async function () {
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    const FORM = new FormData();
    FORM.append('valor', INPUTSEARCH.value);
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(ADMINISTRADOR_API, 'searchRows', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {

            (row.estado_usuario) ? icon = 'bi bi-eye-fill' : icon = 'bi bi-eye-slash-fill';
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <tr>
                    <td>${row.apellido_usuario}</td>
                    <td>${row.nombre_usuario}</td>
                    <td>${row.email_usuario}</td>
                    <td>${row.alias_usuario}</td>
                    <td><i class="${icon}"></i></td>
                    <td>
                    <button type="button" class="btn" onclick="openUpdate(${row.id_usuario})" style="background-color: #AA6231;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="40" fill="#FFFFFF" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                    </button>
                    <button type="button" class="btn" onclick="openDelete(${row.id_usuario})" style="background-color: #AA6231;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="40" fill="#FFFFFF    " class="bi bi-trash-fill" viewBox="0 0 16 16">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                    </svg>
                    </button>
                    </td>
                </tr>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        // sweetAlert(4, DATA.error, true);
    }
});
ALIAS_ADMINISTRADOR.addEventListener('input', async function () {
    const FORM = new FormData();
    FORM.append('usuario', ALIAS_ADMINISTRADOR.value);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(ADMINISTRADOR_API, 'readExist', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status === 1) {
        mensajeDiv.textContent = 'Ya existe el usuario';
        mensajeDiv.style.display = 'block';
        IDGUARDAR.disabled = true;
    } else {
        mensajeDiv.textContent = "";
        IDGUARDAR.disabled = false;
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
    (form) ? action = 'searchRows' : action = 'fillTab';
    // Petición para obtener los registros disponibles.

    const DATA = await fetchData(ADMINISTRADOR_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            console.log(row.estado_usuario);
            (row.estado_usuario) ? icon = 'bi bi-eye-fill' : icon = 'bi bi-eye-slash-fill';
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
            <div class="cardlarUsu row" style="margin-bottom: 10px; margin-left: auto; margin-right: auto;">
            <div class="col-2" style="display: flex; align-items: center;">${row.apellido_usuario}</div>
            <div class="col-2" style="display: flex; align-items: center;">${row.nombre_usuario}</div>
            <div class="col-2" style="display: flex; align-items: center;">${row.email_usuario}</div>
            <div class="col-2" style="display: flex; align-items: center;">${row.alias_usuario}</div>
                <div class="col-1 " style="display: flex; align-items: center;font-size: 30px;""><i  class="${icon}"></i></div>
                <div class="col-lg-2 col-md-2 row ">
                <div class="col-lg-6 col-md-2 col-sm-3 ms-4">
                <button type="button" class="btnAgregar" onclick="openUpdate(${row.id_usuario})" style="margin-top:20px;">
                    <i class="bi bi-pencil-fill"></i>
                </button>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-3">
                <button type="button" class="btnAgregar" onclick="openDelete(${row.id_usuario})" style="margin-top:20px;">
                    <i class="bi bi-trash-fill"></i>
                </button>
            </div>
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

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear administrador';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    ALIAS_ADMINISTRADOR.disabled = false;
    CLAVE_ADMINISTRADOR.disabled = false;
    CONFIRMAR_CLAVE.disabled = false;

    fillSelect(ROL_API, 'fillSelect', 'rolUsuario');
}

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    // Se define una constante tipo objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idAdministrador', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(ADMINISTRADOR_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar administrador';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        ALIAS_ADMINISTRADOR.disabled = true;
        CLAVE_ADMINISTRADOR.disabled = true;
        CONFIRMAR_CLAVE.disabled = true;
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_ADMINISTRADOR.value = ROW.id_usuario;
        NOMBRE_ADMINISTRADOR.value = ROW.nombre_usuario;
        APELLIDO_ADMINISTRADOR.value = ROW.apellido_usuario;
        CORREO_ADMINISTRADOR.value = ROW.email_usuario;
        ALIAS_ADMINISTRADOR.value = ROW.alias_usuario;
        ESTADO_USUARIO.checked = ROW.estado_usuario;
        fillSelect(ROL_API, 'fillSelect', 'rolUsuario', ROW.id_rol);
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
    const RESPONSE = await confirmAction('¿Desea eliminar el administrador de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idAdministrador', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(ADMINISTRADOR_API, 'deleteRow', FORM);
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
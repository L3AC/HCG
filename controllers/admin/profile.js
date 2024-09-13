// Constantes para establecer los elementos del formulario de editar perfil.
const PROFILE_FORM = document.getElementById('profileForm'),
    TWOFA = document.getElementById('twoFA'),
    NOMBRE_ADMINISTRADOR = document.getElementById('nombreAdministrador'),
    APELLIDO_ADMINISTRADOR = document.getElementById('apellidoAdministrador'),
    CORREO_ADMINISTRADOR = document.getElementById('correoAdministrador'),
    ALIAS_ADMINISTRADOR = document.getElementById('aliasAdministrador');
// Constante para establecer la modal de cambiar contraseña.
const PASSWORD_MODAL = new bootstrap.Modal('#passwordModal');
// Constante para establecer el formulario de cambiar contraseña.
const PASSWORD_FORM = document.getElementById('passwordForm');

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = '';
    // Petición para obtener los datos del usuario que ha iniciado sesión.
    const DATA = await fetchData(USER_API, 'readProfile');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializan los campos del formulario con los datos del usuario que ha iniciado sesión.
        const ROW = DATA.dataset;
        console.log(ROW.nombre_usuario);
        NOMBRE_ADMINISTRADOR.value = ROW.nombre_usuario;
        APELLIDO_ADMINISTRADOR.value = ROW.apellido_usuario;
        CORREO_ADMINISTRADOR.value = ROW.email_usuario;
        ALIAS_ADMINISTRADOR.value = ROW.alias_usuario;
        TWOFA.checked = ROW.factor_autenticacion;
    } else {
        sweetAlert(2, DATA.error, null);
    }
});

// Método del evento para cuando se envía el formulario de editar perfil.
PROFILE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(PROFILE_FORM);
    // Petición para actualizar los datos personales del usuario.
    const DATA = await fetchData(USER_API, 'editProfile', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        sweetAlert(1, DATA.message, true);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

// Mètodo del evento para cuando se envía el formulario de cambiar contraseña.
PASSWORD_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(PASSWORD_FORM);
    // Petición para actualizar la constraseña.
    const DATA = await fetchData(USER_API, 'changePassword', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        PASSWORD_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

/*
*   Función para preparar el formulario al momento de cambiar la constraseña.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openPassword = () => {
    // Se abre la caja de diálogo que contiene el formulario.
    PASSWORD_MODAL.show();
    // Se restauran los elementos del formulario.
    PASSWORD_FORM.reset();
}
TWOFA.addEventListener('click', async function (event) {
    const TWOFA = document.getElementById('twoFA'); // Definido una sola vez al inicio
    let message;

    // Prevenir que el checkbox cambie inmediatamente
    event.preventDefault();

    // Definir el mensaje basado en el estado actual del checkbox
    if (TWOFA.checked) {
        message = '¿Desea activar la autenticación por dos pasos?';
    } else {
        message = '¿Desea desactivar la autenticación por dos pasos?';
    }

    // Preguntar al usuario con el mensaje adecuado
    const RESPONSE = await confirmAction(message);

    // Si el usuario confirma, continuamos
    if (RESPONSE) {
        // Cambiar el estado del checkbox según la acción confirmada
        TWOFA.checked = !TWOFA.checked;

        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        console.log('TWOFA.checked:', TWOFA.checked); // Verificar el valor antes de enviarlo
        FORM.append('twoFA', TWOFA.checked ? 1 : 0); // Envía 1 si está marcado, 0 si no lo está

        // Petición para activar/desactivar la autenticación de dos factores
        const DATA = await fetchData(USER_API, 'twoFAMetod', FORM);


        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
});

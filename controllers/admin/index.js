// Constante para establecer el formulario de registro del primer usuario.
const SIGNUP_FORM = document.getElementById('signupForm');
// Constante para establecer el formulario de inicio de sesión.
const LOGIN_FORM = document.getElementById('loginForm');
const USUARIO_ADMIN = document.getElementById('usuariol');
const LIBRERIA = 'libraries/twofa.php';

// Función para enviar el correo
const sendMail = async (data) => {
    try {
        const formData = new FormData();
        formData.append('pin', data.pin_usuario);
        formData.append('user', data.alias_usuario);
        formData.append('email', data.email_usuario);
        console.log(data);

        const response = await fetchData(LIBRERIA, 'twofa', formData);
        console.log('Correo enviado:', response);
    } catch (error) {
        console.error('Error en sendMail:', error.message);
    }
};

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Petición para consultar los usuarios registrados.
    const DATA = await fetchData(USER_API, 'readUsers');
    // Se comprueba si existe una sesión, de lo contrario se sigue con el flujo normal.
    if (DATA.session) {
        // Se direcciona a la página web de bienvenida.
        location.href = 'dashboard.html';
    } else if (DATA.status) {
        // Se establece el título del contenido principal.
        MAIN_TITLE.textContent = 'Iniciar sesión';
        // Se muestra el formulario para iniciar sesión.
        LOGIN_FORM.classList.remove('d-none');
    } else {
        // Se establece el título del contenido principal.
        MAIN_TITLE.textContent = 'Registrar primer usuario';
        // Se muestra el formulario para registrar el primer usuario.
        SIGNUP_FORM.classList.remove('d-none');
    }
});

// Método del evento para cuando se envía el formulario de registro del primer usuario.
SIGNUP_FORM.addEventListener('submit', async (event) => {
    event.preventDefault();
    const FORM = new FormData(SIGNUP_FORM);
    const DATA = await fetchData(USER_API, 'signUp', FORM);
    if (DATA.status) {
        sweetAlert(1, DATA.message, true, 'index.html');
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

// Método del evento para cuando se envía el formulario de inicio de sesión.
LOGIN_FORM.addEventListener('submit', async (event) => {
    event.preventDefault();
    const FORM = new FormData(LOGIN_FORM);
    const DATA = await fetchData(USER_API, 'logIn', FORM);

    if (DATA.dataset == 1) {
        sweetAlert(1, DATA.message, true, 'dashboard.html');
    } else if (DATA.dataset == 2) {
        sweetAlert(2, DATA.message, true);
    } else if (DATA.dataset == 3) {
        sweetAlert(3, DATA.message, true);
    } else if (DATA.dataset == 4) {
        sweetAlert(4, DATA.message, true, 'cambio_clave.html');
    } else if (DATA.dataset == 5) {
        sweetAlert(4, DATA.message, true);
        const FORM = new FormData();
        FORM.append('usuario', USUARIO_ADMIN.value);
        try {
            const DATA = await fetchData(USER_API, 'verif2FA', FORM);
            if (DATA.status) {
                const userData = {
                    pin_usuario: DATA.dataset.pin_usuario,
                    alias_usuario: DATA.dataset.alias_usuario,
                    email_usuario: DATA.dataset.email_usuario
                };
                console.log(userData);
                // Llamada a la función para enviar el correo con los datos.
                await sendMail(userData);

                window.location.href = `../../views/admin/codigoverif.html`;
            } else {
                sweetAlert(2, DATA.error, false);
            }
        } catch (error) {
            console.error(error);
            sweetAlert(2, 'Error en la verificación del usuario', false);
        }
    }
});

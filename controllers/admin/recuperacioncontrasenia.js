// Constante para completar la ruta de la API.
const USUARIO_API = 'services/admin/usuarios.php';
const LIBRERIA = 'libraries/sendCode.php';

// Constantes para llamar los elementos de la página
const BOTON = document.getElementById('boton');
const USUARIO_RECUPERACION = document.getElementById('usuario');
const SAVE_FORM = document.getElementById('saveForm');

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();

    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    FORM.append('usuario', USUARIO_RECUPERACION.value);

    try {
        // Petición para verificar el usuario.
        const DATA = await fetchData(USUARIO_API, 'verifUs', FORM);

        // Se comprueba si la respuesta es satisfactoria
        if (DATA.status) {
            // Mostrar mensaje de éxito.
            await sweetAlert(1, 'Usuario encontrado, revise su correo electrónico', true);

            // Si los datos de usuario son correctos, procedemos a enviar el correo.
            const userData = {
                pin_usuario: DATA.dataset.pin_usuario,
                alias_usuario: DATA.dataset.alias_usuario,
                email_usuario: DATA.dataset.email_usuario
            };

            // Llamada a la función para enviar el correo con los datos.
            await sendMail(userData);

            window.location.href = `../../views/admin/recuperacioncontaseniacodigo.html?id=${DATA.dataset.id_usuario}`;
        } else {
            // Mostrar mensaje de error.
            sweetAlert(2, DATA.error, false);
        }
    } catch (error) {
        console.error(error);
        sweetAlert(2, 'Error en la verificación del usuario', false);
    }
});

const sendMail = async (data) => {
    try {
        const formData = new FormData();
        formData.append('pin', data.pin_usuario);
        formData.append('user', data.alias_usuario);
        formData.append('email', data.email_usuario);

        const response = await fetchData(LIBRERIA, 'sendCode', formData);
    } catch (error) {
        console.error('Error en sendMail:', error.message);
    }
};


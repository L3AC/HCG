// Constante para completar la ruta de la API.
const CLIENTE_API = 'services/public/clientes.php';
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
        const DATA = await fetchData(CLIENTE_API, 'verifUs', FORM);

        // Se comprueba si la respuesta es satisfactoria
        if (DATA.status) {
            // Mostrar mensaje de éxito.
            await sweetAlert(1, 'Usuario encontrado, revise su correo electrónico', true);

            // Si los datos de usuario son correctos, procedemos a enviar el correo.
            const userData = {
                pin_cliente: DATA.dataset.pin_cliente,
                usuario_cliente: DATA.dataset.usuario_cliente,
                correo_cliente: DATA.dataset.correo_cliente
            };

            // Llamada a la función para enviar el correo con los datos.
            await sendMail(userData);

            window.location.href = `../../views/public/recupclavecodigo.html`;
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
        formData.append('pin', data.pin_cliente);
        formData.append('user', data.usuario_cliente);
        formData.append('email', data.correo_cliente);

        const response = await fetchData(LIBRERIA, 'sendCode', formData);
    } catch (error) {
        console.error('Error en sendMail:', error.message);
    }
};


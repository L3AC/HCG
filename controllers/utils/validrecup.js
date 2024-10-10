/*
* Controlador de uso general en las páginas web del sitio privado.
* Sirve para manejar la plantilla del encabezado y pie del documento.
*/

// Constante para completar la ruta de la API.
const USER_API = 'services/admin/usuarios.php';
const CORREO= document.getElementById('correo');

/* Función asíncrona para cargar el encabezado y pie del documento.
* Parámetros: ninguno.
* Retorno: ninguno.
*/

const loadTemplate = async () => {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    const DATA = await fetchData(USER_API, 'getRecup');
    // Se verifica si el usuario está autenticado, de lo contrario se envía a iniciar sesión.
    if (DATA.status) {
        CORREO.value='Ingresa el código enviado a su correo electrónico con la terminación '+DATA.dataset;
    } 
    else {
        console.log('de vuelta');
        // Se comprueba si la página web es la principal, de lo contrario se direcciona a iniciar sesión.
        if (location.pathname.endsWith('index.html')) {
            // Se agrega el encabezado de la página web antes del contenido principal.

        } else {
            location.href = 'verifUs.html';
        }
    }
}
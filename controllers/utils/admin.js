/*
* Controlador de uso general en las páginas web del sitio privado.
* Sirve para manejar la plantilla del encabezado y pie del documento.
*/

// Constante para completar la ruta de la API.
const USER_API = 'services/admin/9usuarios.php';
// Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');

MAIN.classList.add('container');
// Se establece el título de la página web.
document.querySelector('title').textContent = 'YNWA';
// Constante para establecer el elemento del título principal.
const MAIN_TITLE = document.getElementById('mainTitle');
MAIN_TITLE.classList.add('text-center', 'py-3');

/* Función asíncrona para cargar el encabezado y pie del documento.
* Parámetros: ninguno.
* Retorno: ninguno.
*/

const loadTemplate = async () => {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    const DATA = await fetchData(USER_API, 'getUser');
    // Se verifica si el usuario está autenticado, de lo contrario se envía a iniciar sesión.
    if (DATA.session) {
        // Se comprueba si existe un alias definido para el usuario, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se agrega el encabezado de la página web antes del contenido principal.
            MAIN.insertAdjacentHTML('beforebegin', `
            <header>
    <nav class="navbar">
        <div class="container-fluid">
            <a class=" " href="#">
                <img src="../../resources/img/logo.png" alt="Bootstrap" width="70" height="80" type="button"
                    data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">
            </a>
            <div class="d-flex position-absolute top-0 end-0 me-3 mt-2" >
                <a href="../../views/admin/profile.html" style="margin-right: 10px; margin-top: 10px;">
                    <img src="../../resources/img/Perfilito.png" width="40" height="40">
                </a>
                <a href="#" onclick="logOut()" style="margin-top: 10px;">
                    <img src="../../resources/img/logout.png" width="40" height="40">
                </a>
            </div>
            <!-- Offcanvas menu -->
            <div class="offcanvas offcanvas-start" style="background-color: #F1EFEF; border-top-right-radius: 30px; border-bottom-right-radius: 30px;"
                data-bs-backdrop="static" tabindex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
                <div class="offcanvas-header">
                    <h3 class="offcanvas-title" id="staticBackdropLabel">Menú</h3>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item" id="po"><a href="index.html">Inicio</a></li>
                                        <li class="list-group-item" id="marca"><a href="1marcas.html">Marcas</a></li>
                                        <li class="list-group-item" id="modelo"><a href="2modelos.html">Modelos</a></li>
                                        <li class="list-group-item" id="talla"><a href="3tallas.html">Tallas</a></li>
                                        <li class="list-group-item" id="pedido"><a href="4pedidos.html">Pedidos</a></li>
                                        <li class="list-group-item" id="tipon"><a href="5tiponoticia.html">Tipo Noticias</a></li>
                                        <li class="list-group-item" id="noticia"><a href="6noticias.html">Noticias</a></li>
                                        <li class="list-group-item" id="comentario"><a href="7comentarios.html">Comentarios</a></li>
                                        <li class="list-group-item" id="cliente"><a href="8clientes.html">Clientes</a></li>
                                        <li class="list-group-item" id="usuario"><a href="9usuarios.html">Usuarios</a></li>
                                        <li class="list-group-item" id="rol"><a href="10roles.html">Roles</a></li>
                      </ul>
                </div>
            </div>
        </div>
    </nav>
</header>
            `);
            const opc1 = document.getElementById('marca');
            const opc2 = document.getElementById('modelo');
            const opc3 = document.getElementById('talla');
            const opc4 = document.getElementById('pedido');
            const opc5 = document.getElementById('tipon');
            const opc6 = document.getElementById('noticia');
            const opc7 = document.getElementById('comentario');
            const opc8 = document.getElementById('cliente');
            const opc9 = document.getElementById('usuario');
            const opc10 = document.getElementById('rol');

            if (DATA.marcas_opc != 1) {
                opc1.style.display = "none";
            }
            if (DATA.modelos_opc != 1) {
                opc2.style.display = "none";
            }
            if (DATA.tallas_opc != 1) {
                opc3.style.display = "none";
            }
            if (DATA.pedidos_opc != 1) {
                opc4.style.display = "none";
            }
            if (DATA.tipo_noticias_opc != 1) {
                opc5.style.display = "none";
            }
            if (DATA.noticias_opc != 1) {
                opc6.style.display = "none";
            }
            if (DATA.comentarios_opc != 1) {
                opc7.style.display = "none";
            }
            if (DATA.clientes_opc != 1) {
                opc8.style.display = "none";
            }
            if (DATA.usuarios_opc != 1) {
                opc9.style.display = "none";
            }
            if (DATA.roles_opc != 1) {
                opc10.style.display = "none";
            }


            // Se agrega el pie de la página web después del contenido principal.
            MAIN.insertAdjacentHTML('afterend', `
<footer>
    <nav class="navbar fixed-bottom" id="foot">
        <div class="container-fluid">
            <div>
                <h6>YNWA</h6>
                <p><i class="bi bi-c-square"></i>2024 Todos los derechos reservados</p>
            </div>
            <div>
                <h6>Contáctanos</h6>
                <p><i class="bi bi-envelope"></i> YNWA@gmail.com</p>
            </div>
        </div>
    </nav>
</footer>
`);
        } else {
            //sweetAlert(3, DATA.error, false, 'index.html');
        }
    } else {
        console.log('de vuelta');
        // Se comprueba si la página web es la principal, de lo contrario se direcciona a iniciar sesión.
        if (location.pathname.endsWith('index.html')) {
            // Se agrega el encabezado de la página web antes del contenido principal.

        } else {
            location.href = 'index.html';
        }
    }
}
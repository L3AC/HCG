/*
* Controlador de uso general en las páginas web del sitio privado.
* Sirve para manejar la plantilla del encabezado y pie del documento.
*/

// Constante para completar la ruta de la API.
const USER_API = 'services/admin/6usuarios.php';
// Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');

MAIN.classList.add('container');
// Se establece el título de la página web.
document.querySelector('title').textContent = 'HGC';
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
            MAIN.style.paddingTop = '75px';
            MAIN.style.paddingBottom = '100px';
            MAIN.insertAdjacentHTML('beforebegin', `
            <header>
    <nav class="navbar fixed-top">
        <div class="container-fluid">
            <a class=" " href="#">
                <img src="../../resources/img/home.png" alt="Bootstrap" width="50" height="50" type="button"
                    data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">
            </a>
            <div class="d-flex position-absolute top-0 end-0 me-3 mt-2" >
                <a href="../../views/admin/profile.html" style="margin-right: 10px; margin-top: 10px;">
                    <img src="../../resources/img/user.png" width="40" height="40">
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
                                        <li class="list-group-item" id="producto"><a href="1productos.html">Productos</a></li>
                                        <li class="list-group-item" id="pedido"><a href="2pedidos.html">Pedidos</a></li>
                                        <li class="list-group-item" id="tipoitem"><a href="3tipoitems.html">Tipo Items</a></li>
                                        <li class="list-group-item" id="item"><a href="4items.html">Items</a></li>
                                        <li class="list-group-item" id="cliente"><a href="5clientes.html">Clientes</a></li>
                                        <li class="list-group-item" id="usuario"><a href="6usuarios.html">Usuarios</a></li>
                                        <li class="list-group-item" id="rol"><a href="7roles.html">Roles</a></li>
                      </ul>
                </div>
            </div>
        </div>
    </nav>
</header>
            `);
            const opc1 = document.getElementById('producto');
            const opc2 = document.getElementById('pedido');
            const opc3 = document.getElementById('tipoitem');
            const opc4 = document.getElementById('item');
            const opc5 = document.getElementById('cliente');
            const opc6 = document.getElementById('usuario');
            const opc7 = document.getElementById('rol');

            if (DATA.productos_opc != 1) {
                opc1.style.display = "none";
            }
            if (DATA.pedidos_opc != 1) {
                opc2.style.display = "none";
            }
            if (DATA.tipo_items_opc != 1) {
                opc3.style.display = "none";
            }
            if (DATA.items_opc != 1) {
                opc4.style.display = "none";
            }
            if (DATA.clientes_opc != 1) {
                opc5.style.display = "none";
            }
            if (DATA.usuarios_opc != 1) {
                opc6.style.display = "none";
            }
            if (DATA.roles_opc != 1) {
                opc7.style.display = "none";
            }


            // Se agrega el pie de la página web después del contenido principal.
            MAIN.insertAdjacentHTML('afterend', `
<!--<footer>
    <nav class="navbar fixed-bottom" id="foot">
        <div class="container-fluid">
            <div>
                <h6 style="color: white;">HCG</h6>
                <p style="color: white;"><i class="bi bi-c-square"></i>2024 Todos los derechos reservados</p>
            </div>
            <div>
                <h6 style="color: white;">Contáctanos</h6>
                <p style="color: white;"><i class="bi bi-envelope"></i> HCG@gmail.com</p>
            </div>
        </div>
    </nav>
</footer>-->
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
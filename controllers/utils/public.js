/*
*   Controlador es de uso general en las páginas web del sitio público.
*   Sirve para manejar las plantillas del encabezado y pie del documento.
*/

// Constante para completar la ruta de la API.
const USER_API = 'services/public/clientes.php';
// Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');
MAIN.classList.add('container');
// Se establece el título de la página web.
document.querySelector('title').textContent = 'HCG';
// Constante para establecer el elemento del título principal.
const MAIN_TITLE = document.getElementById('mainTitle');
MAIN_TITLE.classList.add('text-center', 'py-3');

/*  Función asíncrona para cargar el encabezado y pie del documento.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const loadTemplate = async () => {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    const DATA = await fetchData(USER_API, 'getUser');
    // Se comprueba si el usuario está autenticado para establecer el encabezado respectivo.
    if (DATA.session) {
        // Se verifica si la página web no es el inicio de sesión, de lo contrario se direcciona a la página web principal.
        if (!location.pathname.endsWith('login.html')) {
            MAIN.style.paddingTop = '75px';
            MAIN.style.paddingBottom = '100px';
            // Se agrega el encabezado de la página web antes del contenido principal.
            MAIN.insertAdjacentHTML('beforebegin', `
            <nav class="navbar navbar-expand-md fixed-top" style="background-color: #5C2C0C; ">
        <div class="container">
            <!-- Left elements -->
            <div class="col-md-2 d-flex justify-content-center justify-content-md-start mb-md-0">
                <!-- Logo -->
                <a class="navbar-brand" href="index.html"><img src="../../resources/img/home.png" height="50"
                        alt="YNWA"></a>
            </div>
            <!-- Left elements -->

            <!-- Center elements -->
            <div class="col-md-3">
                <div class="nav-link">
                    <div class="input-group">
                        <div class="group">
                            <svg class="icon" aria-hidden="true" viewBox="0 0 24 24">
                                <g>
                                    <path
                                        d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z">
                                    </path>
                                </g>
                            </svg>
                            <input id="inputsearch" placeholder="Buscar..." type="search" class="inputSearch" required>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Center elements -->

            <!-- Right elements -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse flex-grow-0" id="navbarSupportedContent">
                <div class="navbar-nav ms-auto">
                    <a class="nav-link" href="cart.html" title="Carrito"><img src="../../resources/img/carrito.png" height="40" alt=""></a>
                    </div>
                <div class="navbar-nav ms-auto">
                <a class="nav-link" href="historial.html" title="Historial"><img src="../../resources/img/historial.png" height="40" alt=""></a>
                </div>
                <div class="navbar-nav ms-auto">
                <a class="nav-link" href="perfil.html" title="Perfil"><img src="../../resources/img/user.png" height="40" alt=""></a>
                </div>
                <div class="navbar-nav ms-auto">
                <a class="nav-link" href="#" onclick="logOut()" title="Cerrar sesión"><img src="../../resources/img/logout.png" height="40" alt=""></a>
                </div>
            </div>
            <!-- Right elements -->
        </div>
    </nav>
            `);

            const SEARCH_MAIN = document.getElementById('inputsearch');
            SEARCH_MAIN.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    console.log(document.activeElement)
                    // Obtener el valor del input
                    const searchValue = SEARCH_MAIN.value;
                    // Redirigir a la página de búsqueda con el valor del input como parámetro
                    window.location.href = 'products.html?producto=' + searchValue;
                }
            });

        } else {
            location.href = 'index.html';
        }
    } else {
        MAIN.style.paddingTop = '75px';
        MAIN.style.paddingBottom = '100px';
        // Se agrega el encabezado de la página web antes del contenido principal.
        MAIN.insertAdjacentHTML('beforebegin', `
        <nav class="navbar navbar-expand-md fixed-top" style="background-color: #5C2C0C; ">
            <div class="container">
                <!-- Left elements -->
                <div class="col-md-2 d-flex justify-content-center justify-content-md-start mb-md-0">
                    <!-- Logo -->
                    <a class="navbar-brand" href="index.html"><img src="../../resources/img/home.png" height="60"
                            alt="YNWA"></a>
                </div>
                <!-- Left elements -->

                <!-- Center elements -->
                <div class="col-md-4">
                    <div class="nav-link">
                        <div class="input-group">
                            <div class="group">
                                <svg class="icon" aria-hidden="true" viewBox="0 0 24 24">
                                    <g>
                                        <path
                                            d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z">
                                        </path>
                                    </g>
                                </svg>
                                <input id="inputsearch" placeholder="Buscar..." type="search" class="inputSearch" required>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Center elements -->

                <!-- Right elements -->
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse flex-grow-0" id="navbarSupportedContent">
                    <div class="navbar-nav ms-auto">
                    <a class="nav-link" href="login.html" title="Inicio de sesion"><img src="../../resources/img/ingresar.png" height="60" alt=""></a>
                    </div>
                </div>
                <!-- Right elements -->
            </div>
        </nav>
        `);

        const SEARCH_MAIN = document.getElementById('inputsearch');
            SEARCH_MAIN.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    console.log(document.activeElement)
                    // Obtener el valor del input
                    const searchValue = SEARCH_MAIN.value;
                    // Redirigir a la página de búsqueda con el valor del input como parámetro
                    window.location.href = 'products.html?producto=' + searchValue;
                }
            });

    }
    // Se agrega el pie de la página web después del contenido principal.
    MAIN.insertAdjacentHTML('afterend', `

    <footer class="text-center text-white " 
    id="foot" style="min-height: auto; ">
        <!-- Grid container -->
        <div class="container pt-1">
            <!-- Section: Social media -->
            <section class="mb-1">
            <!-- Acerca de nosotros -->
            <a class="btn btn-link btn-floating btn-lg text-dark m-1" href="aboutUs.html" role="button"
            data-mdb-ripple-color="dark"><i class="bi bi-question-circle-fill" style="color: white;"></i></a>

            <!-- Facebook -->
            <a class="btn btn-link btn-floating btn-lg text-dark m-1" href="https://facebook.com/" role="button"
            data-mdb-ripple-color="dark"><i class="bi bi-facebook" style="color: white;"></i></a>

            <!-- Twitter -->
            <a class="btn btn-link btn-floating btn-lg text-dark m-1" href="https://twitter.com/" role="button"
            data-mdb-ripple-color="dark"><i class="bi bi-twitter" style="color: white;"></i></a>

            <!-- Instagram -->
            <a class="btn btn-link btn-floating btn-lg text-dark m-1" href="https://instagram.com/" role="button"
            data-mdb-ripple-color="dark"><i class="bi bi-instagram" style="color: white;"></i></a>
            <p style="color: white;">© 2024 Copyright HCG</p>

            </section>
            <!-- Section: Social media -->
        </div>
        <!-- Copyright -->
    </footer>
            
            `);
}

/*
*   Controlador es de uso general en las páginas web del sitio público.
*   Sirve para manejar las plantillas del encabezado y pie del documento.
*/

// Constante para completar la ruta de la API.
const USER_API = 'services/public/cliente.php';
const MARCA_API = 'services/public/marca.php';
// Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');
MAIN.classList.add('container');
// Se establece el título de la página web.
document.querySelector('title').textContent = 'YNWA';
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
            <nav class="navbar navbar-expand-md fixed-top" style="background-color: #CCC8AA; ">
                <div class="container">
                    <!-- Left elements -->
                    <div class="col-md-2 d-flex justify-content-center justify-content-md-start mb-md-0">
                        <!-- Logo -->
                        <a class="navbar-brand" href="index.html"><img src="../../resources/img/logo.png" height="60"
                                alt="YNWA"></a>
                    </div>
                    <!-- Left elements -->
    
                    <!-- Center elements -->
                    <div class="col-md-4">
                        <div class="nav-link">
                            <div class="input-group">
                                <input id="searchMain" type="text" name="searchMain" class="form-control"
                                    placeholder="Búsqueda">
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
                            <li class="nav-item dropdown ">
                                <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false"
                                    href="index.html"><i class="bi bi-tags-fill h3" title="Ver marcas"></i>
                                </a>
                                <ul class="dropdown-menu" id="listmarca">
    
                                </ul>
                            </li>
                            <a class="nav-link" href="cart.html" title="Ir al carrito de compras"><i class="bi bi-cart h3"></i></a>
                            <a class="nav-link" href="historial.html" title="Ver historial de compras"><i class="bi bi-clock-history h3"></i></a>
                            <a class="nav-link" href="perfil.html" title="Ver perfil de usuario"><i class="bi bi-person-fill h3"></i></a>
                            <a class="nav-link" href="#" onclick="logOut()" title="Cerrar sesión"><i class="bi bi-box-arrow-left h3"></i></a>
                        </div>
                    </div>
                    <!-- Right elements -->
                </div>
            </nav>
            `);

            const SEARCH_MAIN = document.getElementById('searchMain');
            SEARCH_MAIN.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    console.log(document.activeElement)
                    // Obtener el valor del input
                    const searchValue = SEARCH_MAIN.value;
                    // Redirigir a la página de búsqueda con el valor del input como parámetro
                    window.location.href = 'products.html?modelo=' + searchValue;
                }
            });


            const LISTA_MARCA = document.getElementById('listmarca');
            const DATA = await fetchData(MARCA_API, 'readAllActive');
            if (DATA.status) {
                // Se inicializa el contenedor de productos.
                LISTA_MARCA.innerHTML = '';
                // Se recorre el conjunto de registros fila por fila a través del objeto row.
                DATA.dataset.forEach(row => {
                    // Se crean y concatenan las tarjetas con los datos de cada producto.
                    LISTA_MARCA.innerHTML += `
                        <li><a class="dropdown-item" 
                        href="products.html?id=${row.id_marca}&nombre=${row.descripcion_marca}">
                        ${row.descripcion_marca}</a></li>
                    `;
                });
            } else {
                // Se presenta un mensaje de error cuando no existen datos para mostrar.
                LISTA_MARCA.innerHTML = `<li><a class="dropdown-item" >No existen marcas</a></li>`;
            }

        } else {
            location.href = 'index.html';
        }
    } else {
        MAIN.style.paddingTop = '75px';
        MAIN.style.paddingBottom = '100px';
        // Se agrega el encabezado de la página web antes del contenido principal.
        MAIN.insertAdjacentHTML('beforebegin', `
        <nav class="navbar navbar-expand-md fixed-top" style="background-color: #CCC8AA; ">
        <div class="container">
            <!-- Left elements -->
            <div class="col-md-2 d-flex justify-content-center justify-content-md-start mb-md-0">
                <!-- Logo -->
                <a class="navbar-brand" href="index.html"><img src="../../resources/img/logo.png" height="60"
                        alt="YNWA"></a>
            </div>
            <!-- Left elements -->

            <!-- Center elements -->
            <div class="col-md-4">
                <div class="nav-link">
                    <div class="input-group">
                        <input id="searchMain" type="text" name="searchMain" class="form-control"
                            placeholder="Búsqueda">
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
                    <li class="nav-item dropdown ">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false"
                            href="index.html"><i class="bi bi-tags-fill"> Ver marcas</i>
                        </a>
                        <ul class="dropdown-menu" id="listmarca">

                        </ul>
                    </li>
                    <a class="nav-link" href="login.html"><i class="bi bi-box-arrow-right"></i> Iniciar sesión</a>
                </div>
            </div>
            <!-- Right elements -->
        </div>
    </nav>
        `);

        const SEARCH_MAIN = document.getElementById('searchMain');
        SEARCH_MAIN.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                console.log(document.activeElement)
                // Obtener el valor del input
                const searchValue = SEARCH_MAIN.value;
                // Redirigir a la página de búsqueda con el valor del input como parámetro
                window.location.href = 'products.html?modelo=' + searchValue;
            }
        });

        const LISTA_MARCA = document.getElementById('listmarca');
        const DATA = await fetchData(MARCA_API, 'readAllActive');
        if (DATA.status) {
            // Se inicializa el contenedor de productos.
            LISTA_MARCA.innerHTML = '';
            // Se recorre el conjunto de registros fila por fila a través del objeto row.
            DATA.dataset.forEach(row => {
                // Se crean y concatenan las tarjetas con los datos de cada producto.
                LISTA_MARCA.innerHTML += `
                    <li><a class="dropdown-item" 
                    href="products.html?id=${row.id_marca}&nombre=${row.descripcion_marca}">
                    ${row.descripcion_marca}</a></li>
                `;
            });
        } else {
            // Se presenta un mensaje de error cuando no existen datos para mostrar.
            LISTA_MARCA.innerHTML = `<li><a class="dropdown-item" >No existen marcas</a></li>`;
        }
    }
    // Se agrega el pie de la página web después del contenido principal.
    MAIN.insertAdjacentHTML('afterend', `
            
                <footer class="text-center text-white fixed-bottom" 
                id="foot" style="min-height: auto; ">
                    <!-- Grid container -->
                    <div class="container pt-1">
                        <!-- Section: Social media -->
                        <section class="mb-1">
                        <!-- Acerca de nosotros -->
                        <a class="btn btn-link btn-floating btn-lg text-dark m-1" href="aboutUs.html" role="button"
                        data-mdb-ripple-color="dark"><i class="bi bi-question-circle-fill"></i></a>

                        <!-- Facebook -->
                        <a class="btn btn-link btn-floating btn-lg text-dark m-1" href="https://facebook.com/" role="button"
                        data-mdb-ripple-color="dark"><i class="bi bi-facebook"></i></a>

                        <!-- Twitter -->
                        <a class="btn btn-link btn-floating btn-lg text-dark m-1" href="https://twitter.com/" role="button"
                        data-mdb-ripple-color="dark"><i class="bi bi-twitter"></i></a>

                        <!-- Instagram -->
                        <a class="btn btn-link btn-floating btn-lg text-dark m-1" href="https://instagram.com/" role="button"
                        data-mdb-ripple-color="dark"><i class="bi bi-instagram"></i></a>


                        </section>
                        <!-- Section: Social media -->
                    </div>
    
                    <!-- Copyright -->
                    <div class="text-center text-dark p-1" style="background-color: rgba(0, 0, 0, 0.2);">
                        © 2024 Copyright YNWA
                    </div>
                    <!-- Copyright -->
                </footer>
            
            `);
}

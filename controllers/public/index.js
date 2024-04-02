// Constante para completar la ruta de la API.
const CATEGORIA_API = 'services/public/1productos.php',
    //NOTICIA_API = 'services/public/noticia.php';
    CATEGORIAS = document.getElementById('conjuntos'),
    COMPLEMENTOS = document.getElementById('complementos')
BTNSLIDE = document.getElementById('btnSlide'),
    CARDSLIDE = document.getElementById('cardSlide'),
    SUBMAIN_TITLE = document.getElementById('submainTitle');

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Constante para obtener el número de horas.
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'Menu del día';
    SUBMAIN_TITLE.textContent = 'Complementos';
    // Petición para obtener las categorías disponibles.
    /*const DATA2 = await fetchData(NOTICIA_API, 'readAllActive');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA2.status) {
        //Se inicializa el contenedor de categorías.
        CARDSLIDE.innerHTML = '';
        BTNSLIDE.innerHTML = '';
        let cBtn = 0;//CONTADOR DE BOTONES DEL SLIDE
        let cElemento = 1;//CONTADOR DE LOS CARROUSEL DEL SLIDE
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA2.dataset.forEach(row => {
            // Se crean y concatenan las tarjetas con los datos de cada categoría.
            BTNSLIDE.innerHTML += `
            <button type="button" data-bs-target="#carouselCaptions" data-bs-slide-to="${cBtn}"
                class="${cBtn === 0 ? 'active' : ''}" aria-current="${cBtn === 0 ? 'true' : 'false'}"
                aria-label="Slide ${cElemento}"></button>

            `;
            CARDSLIDE.innerHTML += `
                <div class="carousel-item ${cBtn === 0 ? 'active' : ''}">
                    <div class="d-flex justify-content-center align-items-center" style="height: 600px; ">
                        <img src="../../api/images/noticias/${row.foto_noticia}" class="d-block w-100 mx-auto"
                            style="max-height: 100%; max-width: 100%; object-fit: contain;" alt="Slide ${cElemento}">
                    </div>
                    <div class="carousel-caption d-md-block text-center">
                        <div style="background-color: transparent; display: inline-block;">
                            <h5
                                style="color: white; background-color: rgba(0, 0, 0, 0.5);  font-size: 1.5rem; margin-bottom: 0.0rem;">
                                ${row.titulo_noticia}</h5>
                            <p style="color: white; background-color: rgba(0, 0, 0, 0.5);  font-size: 1.5rem;">
                                ${row.contenido_noticia}</p>
                        </div>
                    </div>
                </div>
            `;
            cBtn++;
            cElemento++;
        });

    } else {
        // Se asigna al título del contenido de la excepción cuando no existen datos para mostrar.
        // Se crean y concatenan las tarjetas con los datos de cada categoría.
        BTNSLIDE.innerHTML += `
            <button type="button" data-bs-target="#carouselCaptions" data-bs-slide-to="0" class="active" aria-current="true"
                aria-label="Slide 1"></button>`;

        CARDSLIDE.innerHTML += `
            <div class="carousel-item active">
                <img src="../../resources/img/carousel/img1.jpg" class="d-block w-100" alt="Slide 1">
                <div class="carousel-caption d-none d-md-block">
                    <h5>¿Sabías que...?</h5>
                    <p>El café reduce el riesgo de padecer Alzheimer.</p>
                </div>
            </div>`;
    }*/

    // Petición para obtener las categorías disponibles.
    const DATA = await fetchData(CATEGORIA_API, 'readConjunto');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializa el contenedor de categorías.
        CATEGORIAS.innerHTML = '';
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            console.log(row.id_producto);
            // Se crean y concatenan las tarjetas con los datos de cada categoría.
            /*col-sm-12 col-md-6 col-lg-3*/
            CATEGORIAS.innerHTML += `
            <div class="cardv col-lg-3 col-md-6 " style="margin-bottom: 20px; margin-right: 60px;">
                    <div class="image_container">
                        <img src="${row.imagen_producto}" alt="" class="image">
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <div class="title">
                                <span class="titulo">${row.descripcion_producto}</span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <div class="size">
                                <span class="Horario">Horario: ${row.horario_producto}</span><br>
                                
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="action">
                        <div class="col-lg-4 col-md-6 col-sm-6">
                            <div class="price">
                                <span>$${row.precio_producto}</span>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3">
                            <button type="button" class="btnAgregar" onclick="openUpdate(${row.id_producto})">
                                <i class="bi bi-plus-lg"></i>
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            `;
        });

        const DATA2 = await fetchData(CATEGORIA_API, 'readComplemento');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA2.status) {
            // Se inicializa el contenedor de categorías.
            COMPLEMENTOS.innerHTML = '';
            // Se recorre el conjunto de registros fila por fila a través del objeto row.
            DATA2.dataset.forEach(row => {
                // Se crean y concatenan las tarjetas con los datos de cada categoría.
                /*col-sm-12 col-md-6 col-lg-3*/
                COMPLEMENTOS.innerHTML += `
                <div class="cardv col-lg-3 col-md-6 " style="margin-bottom: 20px; margin-right: 60px;">
                        <div class="image_container" >
                            <img src="${row.imagen_producto}" alt="" class="image">
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="title">
                                    <span class="titulo">${row.descripcion_producto}</span>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="size">
                                    <span class="Horario">Horario: ${row.horario_producto}</span><br>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="action">
                            <div class="col-lg-4 col-md-6 col-sm-6">
                                <div class="price">
                                    <span>$${row.precio_producto}</span>
                                </div>
                            </div>
                                <div class="col-lg-3 col-md-3 col-sm-3">
                                <button type="button" class="btnAgregar" onclick="openUpdate(${row.id_producto})">
                                    <i class="bi bi-plus-lg"></i>
                                </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    } else {
        // Se asigna al título del contenido de la excepción cuando no existen datos para mostrar.
        document.getElementById('mainTitle').textContent = DATA.error;
    }

});
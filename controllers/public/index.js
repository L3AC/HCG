// Constante para completar la ruta de la API.
const PEDIDOS_API = 'services/public/productos.php',
    //NOTICIA_API = 'services/public/noticia.php';
    CONJUNTOS = document.getElementById('conjuntos'),
    COMPLEMENTOS = document.getElementById('complementos'),
BTNSLIDE = document.getElementById('btnSlide'),
    CARDSLIDE = document.getElementById('cardSlide'),
    SUBMAIN_TITLE1 = document.getElementById('submainTitle1'),
    SUBMAIN_TITLE2 = document.getElementById('submainTitle2');

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Constante para obtener el número de horas.
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'Menu del día';
    SUBMAIN_TITLE2.textContent = 'Complementos';

    // Petición para obtener las categorías disponibles.

    const FORM = new FormData();
    FORM.append('producto','');
    const DATA = await fetchData(PEDIDOS_API, 'searchProductos',FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializa el contenedor de categorías.
        CONJUNTOS.innerHTML = '';
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.conjunto.forEach(row => {
            console.log(row.id_producto);
            // Se crean y concatenan las tarjetas con los datos de cada categoría.
            CONJUNTOS.innerHTML += `
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
                            <a href="detail.html?id=${row.id_producto}" class="btn90">
                                <button type="button" class="btnAgregar">
                                    <i class="bi bi-plus-lg"></i>
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
            // Se inicializa el contenedor de categorías.
            COMPLEMENTOS.innerHTML = '';
            // Se recorre el conjunto de registros fila por fila a través del objeto row.
            DATA.dataset.complementario.forEach(row => {
                // Se crean y concatenan las tarjetas con los datos de cada categoría.
                /*col-sm-12 col-md-6 col-lg-3*/
                COMPLEMENTOS.innerHTML += `
                <div class="cardv col-lg-3 col-md-6 " style="margin-bottom: 100px; margin-right: 60px;">
                        <div class="image_container" >
                            <img src="${row.imagen_producto}" alt="" class="image">
                        </div>
                        <div class="row">
                            <div class="col-12" >
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
                                    <a href="detail.html?id=${row.id_producto}" >
                                        <Button class="btnAgregar">+</Button>
                                    </a>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        else {
            // Se asigna al título del contenido de la excepción cuando no existen datos para mostrar.
            MAIN_TITLE.textContent = DATA.error;
        }

});
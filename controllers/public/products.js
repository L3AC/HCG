// Constante para completar la ruta de la API.
const PRODUCTO_API = 'services/public/productos.php';
// Constante tipo objeto para obtener los parámetros disponibles en la URL.
const PARAMS = new URLSearchParams(location.search);
const PRODUCTOS = document.getElementById('productos'),
CONJUNTOS = document.getElementById('conjuntos'),
COMPLEMENTOS = document.getElementById('complementos'),
    SUBMAIN_TITLE2 = document.getElementById('submainTitle2');

// Método manejador de eventos para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    action="";
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    SUBMAIN_TITLE2.textContent = 'Complementos';
    // Se define un objeto con los datos de la categoría seleccionada.
    const FORM = new FormData();
    /*if (PARAMS.has('id')) {
        FORM.append('idCategoria', PARAMS.get('id'));
        MAIN_TITLE.textContent = ` ${PARAMS.get('nombre')}`;
        action='readProductosCategoria';
        console.log(2);
    }*/
    if (PARAMS.has('producto')) {
        FORM.append('producto', PARAMS.get('producto'));
        action='searchProductos';
    }
    // Petición para solicitar los productos de la categoría seleccionada.
    const DATA = await fetchData(PRODUCTO_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializa el contenedor de categorías.
        CONJUNTOS.innerHTML = '';
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.conjunto.forEach(row => {
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
            if(!DATA.dataset.complementario){
                SUBMAIN_TITLE2.textContent ='';
            }
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
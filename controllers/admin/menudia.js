const MENU_API = 'services/admin/productos.php';
const CONJUNTOS = document.getElementById('conjuntos');
const COMPLEMENTOS = document.getElementById('complementos');


document.addEventListener('DOMContentLoaded', async () => {

    // Petición para obtener las categorías disponible

    const DATA = await fetchData(MENU_API, 'menuProductos');
    console.log(DATA);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializa el contenedor de categorías.
        CONJUNTOS.innerHTML = '';
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.conjunto.forEach(row => {
            // Se crean y concatenan las tarjetas con los datos de cada categoría.
            CONJUNTOS.innerHTML += `
            <div class="menu-item">
                    <p>${row.descripcion_producto}</p>
                    <p class="price">$${row.precio_producto}</p>
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

    }

});
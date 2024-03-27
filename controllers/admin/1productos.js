// Constantes para completar las rutas de la API.
const PRODUCTO_API = 'services/admin/1productos.php',
    ITEM_API = 'services/admin/4items.php',
    DETALLEPRODUCTO_API = 'services/admin/8detalleproductos.php';
// Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm'),
    SEARCHSUB_FORM = document.getElementById('searchsubForm');
// Constantes para establecer el contenido de la tabla.
const SUBTABLE_HEAD = document.getElementById('subheaderT'),
    SUBTABLE = document.getElementById('subtable'),
    SUBTABLE_BODY = document.getElementById('subtableBody'),
    TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound'),
    SUBROWS_FOUND = document.getElementById('subrowsFound'),

    SUBTABLE_HEADU = document.getElementById('subheaderTU'),
    SUBTABLEU = document.getElementById('subtableU'),
    SUBTABLE_BODYU = document.getElementById('subtableBodyU'),
    TABLE_BODYU = document.getElementById('tableBodyU'),
    ROWS_FOUNDU = document.getElementById('rowsFoundU'),
    SUBROWS_FOUNDU = document.getElementById('subrowsFoundU');

// Constantes para establecer los elementos  del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle'),
    SUBMODAL_TITLE = document.getElementById('submodalTitle'),
    SAVE_MODALU = new bootstrap.Modal('#saveModalU'),
    MODAL_TITLEU = document.getElementById('modalTitleU'),
    SUBMODAL_TITLEU = document.getElementById('submodalTitleU');

// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_PRODUCTO = document.getElementById('idProducto'),
    NOMBRE_PRODUCTO = document.getElementById('nombreProducto'),
    TIPO_PRODUCTO = document.getElementById('tipoProducto'),
    DESCRIPCION_PRODUCTO = document.getElementById('descripcionProducto'),
    PRECIO_PRODUCTO = document.getElementById('precioProducto'),
    EXISTENCIAS_PRODUCTO = document.getElementById('existenciasProducto'),
    ESTADO_PRODUCTO = document.getElementById('estadoProducto');
    IMAGEN_PRODUCTO = document.getElementById('imagenProducto'),
    IMAGEN_PRE = document.getElementById('imgPre');


//CONSTANTES PARA EL FORMULARIO DE ACTUALIZAR
const SAVE_FORMU = document.getElementById('saveFormU'),
    ID_PRODUCTOU = document.getElementById('idProductoU'),
    NOMBRE_PRODUCTOU = document.getElementById('nombreProductoU'),
    TIPO_PRODUCTOU = document.getElementById('tipoProductoU'),
    DESCRIPCION_PRODUCTOU = document.getElementById('descripcionProductoU'),
    PRECIO_PRODUCTOU = document.getElementById('precioProductoU'),
    EXISTENCIAS_PRODUCTOU = document.getElementById('existenciasProductoU'),
    ESTADO_PRODUCTOU = document.getElementById('estadoProductoU');
    IMAGEN_PRODUCTOU = document.getElementById('imagenProductoU'),
    IMAGEN_PREU = document.getElementById('imgPreU');
    SELECTED_ITEMU = document.getElementById('selectedItemsListU');

// Constantes para establecer los elementos del formulario de modelo tallas de guardar.
const SAVE_TREMODAL = new bootstrap.Modal('#savetreModal'),
    TREMODAL_TITLE = document.getElementById('tremodalTitle');
const SAVE_TREFORM = document.getElementById('savetreForm'),
    ID_DETALLEPRODUCTO = document.getElementById('idDetalleProducto'),
    ID_ITEM = document.getElementById('idItem'),
    CANTIDAD_ITEM = document.getElementById('cantidadItem');

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'Gestionar productos';
    // Llamada a la función para llenar la tabla con los registros existentes.
    fillTable();
});

// Método del evento para cuando se envía el formulario de buscar.
SEARCH_FORM.addEventListener('submit', (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SEARCH_FORM);
    // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
    fillTable(FORM);
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_PRODUCTO.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(PRODUCTO_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        ID_PRODUCTO.value = null;
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(PRODUCTO_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del producto.
            (row.estado_producto) ? icon = 'bi bi-eye-fill' : icon = 'bi bi-eye-slash-fill';
            
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <div class="cardv col-lg-3 col-md-3 col-md-10" style="margin-bottom: 20px; margin-right: 60px;">
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
                                <p class="Esta">Estado:<i class="${icon}"></i></p>
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
                                <i class="bi bi-pencil-fill"></i>
                            </button>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3">
                            <button type="button" class="btnAgregar" onclick="openDelete(${row.id_producto})">
                                <i class="bi bi-trash-fill"></i>
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    IMAGEN_PRE.innerHTML = '';
    MODAL_TITLE.textContent = 'Crear registro';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillsubTable(SEARCHSUB_FORM);
}



/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea inactivar el producto de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idProducto', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(PRODUCTO_API, 'deleteRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillTable();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}
/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillsubTable = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    SUBROWS_FOUND.textContent = '';
    SUBTABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAllActive';
    // Petición para obtener los resistros disponibles.
    const DATA = await fetchData(ITEM_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            const item = document.createElement("tr");
            item.setAttribute('data-id', row.id_item); // Añadimos el atributo data-id
            item.innerHTML = `
                <td>${row.descripcion_item}</td>
                <td>${row.descripcion_tipo_item}</td>
                <td>
                    <button type="button" class="btn btn-primary" onclick="selectItem(${row.id_item})">
                        <i class="bi bi-plus-square-fill"></i>
                    </button>
                </td>
            `;
            SUBTABLE_BODY.appendChild(item);
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        SUBROWS_FOUND.textContent = DATA.message;
    } else {
        //sweetAlert(4, DATA.error, true);
    }
}
let selectedItems = [];
// Función para seleccionar un item y moverlo a la lista de elementos seleccionados.
const selectItem = (id_item) => {
    // Buscamos el elemento en la tabla.
    const itemRow = document.querySelector(`#subtableBody tr[data-id="${id_item}"]`);
    if (itemRow) {
        // Verificamos si el item ya fue seleccionado.
        const selectedItem = selectedItemsList.querySelector(`li[data-id="${id_item}"]`);
        if (selectedItem) {
            // Si ya fue seleccionado, incrementamos la cantidad.
            const quantityInput = selectedItem.querySelector('.quantity');
            quantityInput.value = parseInt(quantityInput.value) + 1;
        } else {
            // Si no ha sido seleccionado, creamos un nuevo item en la lista de elementos seleccionados.
            const clonedItem = itemRow.cloneNode(true);
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.className = 'quantity';
            quantityInput.value = '1';
            quantityInput.min = '1'; // Establecemos el mínimo valor permitido
            quantityInput.addEventListener('input', () => {
                if (parseInt(quantityInput.value) <= 0) {
                    quantityInput.value = '1';
                }
            });
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'btn btn-danger';
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => {
                selectedItemsList.removeChild(clonedItem);
                itemRow.style.display = 'table-row';
                // Remover el item de la lista temporal
                selectedItems = selectedItems.filter(item => item.id !== id_item);
            });
            clonedItem.querySelector('td:last-child').innerHTML = '';
            clonedItem.querySelector('td:last-child').appendChild(quantityInput);
            clonedItem.querySelector('td:last-child').appendChild(deleteButton);
            clonedItem.setAttribute('data-id', id_item);
            selectedItemsList.appendChild(clonedItem);
            itemRow.style.display = 'none';
            // Agregar el item a la lista temporal
            selectedItems.push({ id: id_item, quantity: 1 });
        }
    }
};

const subclose = () => {
    SAVE_MODALU.show();
}

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idProducto', id);

    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(PRODUCTO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODALU.show();
        // Se prepara el formulario.
        SAVE_FORMU.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_PRODUCTOU.value = ROW.id_producto;
        NOMBRE_PRODUCTOU.value = ROW.descripcion_producto;
        for (var i = 0; i < TIPO_PRODUCTOU.options.length; i++) {
            // Si el valor de la opción es igual al valor que quieres seleccionar
            if (TIPO_PRODUCTOU.options[i].value === ROW.tipo_producto) {
                // Seleccionar la opción
                TIPO_PRODUCTOU.selectedIndex = i;
                break; // Salir del bucle una vez seleccionada la opción
            }
        }
        IMAGEN_PRODUCTOU.value = ROW.imagen_producto;

        IMAGEN_PREU.style.maxWidth = '300px';
        IMAGEN_PREU.style.maxHeight = 'auto';
        IMAGEN_PREU.style.margin = '20px auto';
        IMAGEN_PREU.innerHTML = '';
        IMAGEN_PREU.insertAdjacentHTML(
            "beforeend",
            `<img src="${ROW.imagen_producto}">` // Backticks para img variable
        );        
        ESTADO_PRODUCTOU.checked = ROW.estado_producto;

        fillsubTableU('',ROW.id_producto);
    } else {
        //sweetAlert(2, DATA.error, false);
    }
}
const fillsubTableU = async (busqueda,idProducto) => {
    // Se inicializa el contenido de la tabla.
    SUBROWS_FOUNDU.textContent = '';
    SUBTABLE_BODYU.innerHTML = '';
    const FORM = new FormData();
    FORM.append('busqueda', busqueda);
    FORM.append('idProducto', idProducto);

    // Petición para obtener los resistros disponibles.
    const DATA = await fetchData(ITEM_API, 'readAllNot', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            const item = document.createElement("tr");
            item.setAttribute('data-id', row.id_item); // Añadimos el atributo data-id
            item.innerHTML = `
                <td>${row.descripcion_item}</td>
                <td>${row.descripcion_tipo_item}</td>
                <td>
                    <button type="button" class="btn btn-primary" 
                    onclick="opensubCreate(${row.id_item},${idProducto})">
                        <i class="bi bi-plus-square-fill"></i>
                    </button>
                </td>
            `;
            SUBTABLE_BODYU.appendChild(item);
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        SUBROWS_FOUNDU.textContent = DATA.message;
    } else {
        //sweetAlert(4, DATA.error, true);
    }
    //CARGAR LA LISTA DE LOS ITEMS DEL PRODUCTO QUE ESTAN EN LA BASE
    SELECTED_ITEMU.innerHTML = '';
    const FORM2 = new FormData();
    FORM2.append('idProducto', idProducto);
    const DATA2 = await fetchData(DETALLEPRODUCTO_API, 'readByProducto', FORM2);
    if (DATA2.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA2.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            const item = document.createElement("tr");
            item.setAttribute('data-id', row.id_detalle_producto); // Añadimos el atributo data-id
            item.innerHTML = `
                <td>${row.descripcion_item}</td>
                <td>${row.descripcion_tipo_item}</td>
                <td>${row.cantidad_item}</td>
                <td>
                    <button type="button" class="btn btn-info" 
                    onclick="opensubUpdate(${row.id_detalle_producto},${row.id_producto})">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button type="button" class="btn btn-danger" 
                    onclick="opensubDelete(${row.id_detalle_producto},${row.id_producto})">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            `;
            SELECTED_ITEMU.appendChild(item);
        });
    } else {
        //sweetAlert(4, DATA.error, true);
    }
}
// Método del evento para cuando se envía el formulario de guardar.
SAVE_TREFORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    //event.preventDefault();
    // Se verifica la acción a realizar.
    console.log(ID_DETALLEPRODUCTO.value);
    (ID_DETALLEPRODUCTO.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_TREFORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(DETALLEPRODUCTO_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_TREMODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        ID_DETALLEPRODUCTO.value = null;
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillsubTable('',ID_PRODUCTO.value);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});
/*MODAL DE AGREGAR ITEM*/ 
const opensubCreate = (idItem,idProducto) => {
    SAVE_MODALU.hide();
    ID_ITEM.value = idItem;
    ID_PRODUCTO.value = idProducto;
    SAVE_TREMODAL.show();
    //SAVE_MODAL.hidden = false;
    TREMODAL_TITLE.textContent = 'Agregar item';
    // Se prepara el formulario.
    SAVE_TREFORM.reset();
}

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const opensubUpdate = async (idDetalle,idProducto) => {
    // Se define un objeto con los datos del registro seleccionado.
    SAVE_MODALU.hide();
    const FORM = new FormData();
    FORM.append('idDetalleProducto', idDetalle);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(DETALLEPRODUCTO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_TREMODAL.show();
        TREMODAL_TITLE.textContent = 'Editar Cantidad';
        // Se prepara el formulario.
        SAVE_TREFORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_DETALLEPRODUCTO.value = ROW.id_detalle_producto;
        CANTIDAD_ITEM.value = ROW.cantidad_item;

    } else {
        sweetAlert(2, DATA.error, false);
    }
}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const opensubDelete = async (idDetalle,idProducto) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea inactivar el item?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idDetalleProducto', idDetalle);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(DETALLEPRODUCTO_API, 'deleteRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            const selectedItemsList = document.getElementById('selectedItemsListU');
            const itemToDelete = selectedItemsList.querySelector(`tr[data-id="${idDetalle}"]`);
            if (itemToDelete) {
                selectedItemsList.removeChild(itemToDelete);
            }
            // Refrescar la tabla de los items no seleccionados
            fillsubTableU('',idProducto);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}


/*
*   Función para abrir un reporte automático de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openReport = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/admin/productos.php`);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}
IMAGEN_PRODUCTOU.addEventListener('input', function() {
    const existingImage = IMAGEN_PREU.querySelector('img');
    if (existingImage) {
      existingImage.src = this.value;
    } else {
      const newImage = document.createElement('img');
      newImage.src = this.value;
      newImage.style.maxWidth = '300px';
      newImage.style.maxHeight = 'auto';
      newImage.style.margin = '20px auto';
      IMAGEN_PREU.appendChild(newImage);
    }
  });
IMAGEN_PRODUCTO.addEventListener('input', function() {
    const existingImage = IMAGEN_PRE.querySelector('img');
    if (existingImage) {
      existingImage.src = this.value;
    } else {
      const newImage = document.createElement('img');
      newImage.src = this.value;
      newImage.style.maxWidth = '300px';
      newImage.style.maxHeight = 'auto';
      newImage.style.margin = '20px auto';
      IMAGEN_PRE.appendChild(newImage);
    }
  });
// Agregar un evento click a la imagen para aplicar un zoom
/*IMAGEN_PREU.addEventListener('click', function () {
    IMAGEN_PRE.style.transform = 'scale(3)'; 
    event.stopPropagation(); 
});

document.addEventListener('click', function() {
    IMAGEN_PREU.style.transform = 'scale(1)'; 
});*/

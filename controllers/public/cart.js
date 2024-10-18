// Constante para completar la ruta de la API.
const PRODUCTO_API = 'services/public/productos.php',
    PEDIDO_API = 'services/public/pedidos.php',
    DETALLEPEDIDO_API = 'services/public/detallepedidos.php';
// Constante para establecer el cuerpo de la tabla.
const TABLE_BODY = document.getElementById('tableBody');
// Constante para establecer la caja de diálogo de cambiar producto.
const ITEM_MODAL = new bootstrap.Modal('#itemModal');
// Constante para establecer el formulario de cambiar producto.
const ITEM_FORM = document.getElementById('itemForm');
const ID_PRODUCTO = document.getElementById('idDetallePedido'),
    CANTIDAD = document.getElementById('cantidadProducto'),
    NOTA_PRODUCTO = document.getElementById('notaProducto'),
    ID_MODELO_TALLA = document.getElementById('idModeloTalla'),
    STOCK_INFO = document.getElementById('stock'),
    mensajeDiv = document.getElementById('mensajeDiv'),
    IDGUARDAR = document.getElementById('idGuardar');


// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'Carrito de compras';
    // Llamada a la función para mostrar los productos del carrito de compras.
    readDetail();
/*
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        sweetAlert(4, "El carrito está vacío", true, "index.html");
    } else {
        
    }*/
});


/*
* Función para obtener el detalle del carrito de compras.
* Parámetros: ninguno.
* Retorno: ninguno.
*/
async function readDetail() {
    //const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const DATA = await fetchData(PEDIDO_API, 'readDetail');
    if (DATA.status) {
        // Se inicializa el cuerpo de la tabla.
        TABLE_BODY.innerHTML = '';
        // Se declara e inicializa una variable para calcular el importe por cada producto.
        let subtotal = 0;
        // Se declara e inicializa una variable para sumar cada subtotal y obtener el monto final a pagar.
        let total = 0;
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(ROW => {
            subtotal = ROW.precio_producto * ROW.cantidad_pedido;
            total += subtotal;
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
            <div class="cardlard mb-3" id="detalle" style="background-color: #F1EFEF;">
                <div class="row g-0 cardlard" style="background-color: #E3DECA;">
                    <div class="col-lg-4 col-md-12 col-sm-12">
                        <img height="80px" width="100%" src="${ROW.imagen_producto}"
                            class="img-fluid" style="border-radius:20px;" alt="${ROW.descripcion_producto}">
                    </div>
                    <div class="col-lg-5 col-md-12 col-sm-12">
                        <div class="card-body">
                            <input type="hidden" id="idModelo" name="idModelo" value="${ROW.id_producto}">
                            <h5 class="card-title" style="font-size: 40px;">${ROW.descripcion_producto}</h5>
                            <p class="card-text" style="font-size: 20px;">
                                <strong>Precio:</strong> $${ROW.precio_producto}<br>
                                <strong>Cantidad:</strong> ${ROW.cantidad_pedido}<br>
                                <strong>Subtotal:</strong> $ ${subtotal.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-12 col-sm-12 ">
                        <div class="row">
                            <div class="col-lg-5 col-md-6 col-sm-12">
                                <button class="btnAgregare "
                                    onclick="openUpdate(${ROW.id_detalle_pedido});"
                                    style=" margin-right: 10px;">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                            </div>
                            <div class="col-lg-5 col-md-6 col-sm-12">
                                <button class="btnAgregare " onclick="openDelete(${ROW.id_detalle_pedido})" 
                                style="text-align: center;">
                                <i class="bi bi-trash3"></i>
                                </button>
                            </div>
                            <div class="col-1"></div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        // Se muestra el total a pagar con dos decimales.
        document.getElementById('pago').textContent = total.toFixed(2);
    } else {
        sweetAlert(4, DATA.error, false, 'index.html');
    }
}
/*
* Función para abrir la caja de diálogo con el formulario de cambiar cantidad de producto.
* Parámetros: id (identificador del producto) y quantity (cantidad actual del producto).
* Retorno: ninguno.
*/

/*
* Función asíncrona para mostrar un mensaje de confirmación al momento de finalizar el pedido.
* Parámetros: ninguno.
* Retorno: ninguno.
*/
async function finishOrder() {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Está seguro de finalizar el pedido?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Petición para finalizar el pedido en proceso.
        const DATA = await fetchData(PEDIDO_API, 'finishOrder');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            sweetAlert(1, DATA.message, true, 'index.html');
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

/*
* Función asíncrona para mostrar un mensaje de confirmación al momento de eliminar un producto del carrito.
* Parámetros: id (identificador del producto).
* Retorno: ninguno.
*/


const openUpdate = async (idProducto) => {
    ITEM_MODAL.show();
    ITEM_FORM.reset();
    const FORM = new FormData();
    FORM.append('idDetallePedido', idProducto);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(DETALLEPEDIDO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        ITEM_MODAL.show();
        // Se prepara el formulario.
        ITEM_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_PRODUCTO.value = ROW.id_detalle_pedido;
        CANTIDAD.value = ROW.cantidad_pedido;
        NOTA_PRODUCTO.value = ROW.nota_pedido;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

// Método del evento para cuando se envía el formulario de cambiar cantidad de producto.
ITEM_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(ITEM_FORM);
    // Petición para actualizar la cantidad de producto.
    const DATA = await fetchData(DETALLEPEDIDO_API, 'updateRow', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se actualiza la tabla para visualizar los cambios.
        readDetail();
        // Se cierra la caja de diálogo del formulario.
        ITEM_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

async function openDelete(idProducto) {
    const RESPONSE = await confirmAction('¿Está seguro de eliminar el detalle?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        const FORM = new FormData();
        FORM.append('idDetallePedido', idProducto);
        const DATA = await fetchData(DETALLEPEDIDO_API, 'deleteRow', FORM);
        if (DATA.status) {
            readDetail();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}


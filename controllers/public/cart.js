// Constante para completar la ruta de la API.
const PRODUCTO_API = 'services/public/1productos.php',
    PEDIDO_API = 'services/public/3pedidos.php',
    DETALLEPEDIDO_API = 'services/public/4detallepedidos.php';
// Constante para establecer el cuerpo de la tabla.
const TABLE_BODY = document.getElementById('tableBody');
// Constante para establecer la caja de diálogo de cambiar producto.
const ITEM_MODAL = new bootstrap.Modal('#itemModal');
// Constante para establecer el formulario de cambiar producto.
const ITEM_FORM = document.getElementById('itemForm');
const ID_PRODUCTO = document.getElementById('idProducto'),
    CANTIDAD = document.getElementById('cantidadProducto'),
    NOTA_PRODUCTO = document.getElementById('notaProducto'),
    ID_MODELO_TALLA = document.getElementById('idModeloTalla'),
    STOCK_INFO = document.getElementById('stock'),
    mensajeDiv = document.getElementById('mensajeDiv'),
    IDGUARDAR = document.getElementById('idGuardar');

const CLIENTE_MODAL = new bootstrap.Modal('#clienteModal')
CLIENTE_FORM = document.getElementById('clienteForm'),
    NOMBRE_CLIENTE = document.getElementById('nombreCliente'),
    APELLIDO_CLIENTE = document.getElementById('apellidoCliente'),
    TELEFONO_CLIENTE = document.getElementById('telefonoCliente'),
    CORREO_CLIENTE = document.getElementById('correoCliente');

vanillaTextMask.maskInput({
    inputElement: document.getElementById('telefonoCliente'),
    mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
});
// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'Carrito de compras';
    // Llamada a la función para mostrar los productos del carrito de compras.
    readDetail();

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        sweetAlert(4, "El carrito está vacío", true, "index.html");
    } else {
        
    }
});
CLIENTE_FORM.addEventListener('submit', async (event) => {
    event.preventDefault();
    const FORM = new FormData(CLIENTE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(PEDIDO_API, "createRow", FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {   

        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        for (const item of carrito) {
            const FORM2 = new FormData();
            console.log(DATA.dataset.id_pedido);
            FORM2.append('idPedido', DATA.dataset.id_pedido);
            FORM2.append('idProducto', item.idProducto);
            FORM2.append('cantidadProducto', item.cantidad);

            const DATA2 = await fetchData(DETALLEPEDIDO_API, "createRow", FORM2);
            if (DATA2.status) {
                
            } else {
                // Mostrar mensaje de error si la petición falla
                sweetAlert(4, DATA2.error, false);
            }
        }
        localStorage.setItem('carrito', JSON.stringify([]));
        sweetAlert(1, DATA.message, true,"index.html");
        CLIENTE_MODAL.hide();
    } else {
        
        sweetAlert(2, DATA.error, false);
    }
});

/*
* Función para obtener el detalle del carrito de compras.
* Parámetros: ninguno.
* Retorno: ninguno.
*/
async function readDetail() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    // Inicializar el cuerpo de la tabla
    TABLE_BODY.innerHTML = '';
    // Inicializar el total a pagar
    let total = 0;

    // Recorrer el carrito
    for (const item of carrito) {
        // Petición para obtener la información del producto
        const FORM = new FormData();
        FORM.append('idProducto', item.idProducto);
        const DATA = await fetchData(PRODUCTO_API, 'readOne', FORM);

        // Verificar si la respuesta es satisfactoria
        if (DATA.status) {
            const ROW = DATA.dataset;

            // Calcular el subtotal
            const subtotal = parseFloat(ROW.precio_producto) * parseInt(item.cantidad);
            total += subtotal;

            // Agregar la fila a la tabla
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
                            <strong>Cantidad:</strong> ${item.cantidad}<br>
                            <strong>Subtotal:</strong> $ ${subtotal.toFixed(2)}
                        </p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-12 col-sm-12 ">
                    <div class="row">
                        <div class="col-lg-5 col-md-6 col-sm-12">
                            <button class="btnAgregare "
                                onclick="openUpdate(${item.idProducto},${item.cantidad});"
                                style=" margin-right: 10px;">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </div>
                        <div class="col-lg-5 col-md-6 col-sm-12">
                            <button class="btnAgregare " onclick="openDelete(${item.idProducto})" 
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
        } else {
            // Mostrar mensaje de error si la petición falla
            sweetAlert(4, DATA.error, false, 'index.html');
        }
    }
    // Mostrar el total a pagar
    document.getElementById('pago').textContent = total.toFixed(2);
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
const openCliente = async () => {
    CLIENTE_MODAL.show();
    CLIENTE_FORM.reset();
}

const openUpdate = async (idProducto) => {
    ITEM_MODAL.show();
    ITEM_FORM.reset();
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const index = carrito.findIndex(item => item.idProducto === idProducto);
    if (index >= 0) {
        ID_PRODUCTO.value = idProducto;
        CANTIDAD.value = carrito[index].cantidad;
        NOTA_PRODUCTO.value = carrito[index].nota;
        // Almacenar el índice en una propiedad del formulario
        ITEM_FORM.dataset.index = index;
    }
}

ITEM_FORM.addEventListener('submit', async (event) => {
    event.preventDefault();
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const index = parseInt(ITEM_FORM.dataset.index);
    // Si el índice es válido, actualizar la cantidad del producto en el carrito
    if (!isNaN(index) && index >= 0 && index < carrito.length) {
        carrito[index].cantidad = CANTIDAD.value;
        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    ITEM_MODAL.hide();
    readDetail(); // Volver a cargar los detalles del carrito
});

async function openDelete(idProducto) {
    const RESPONSE = await confirmAction('¿Está seguro de finalizar el pedido?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        // Filtrar el carrito para eliminar el producto con el id indicado
        carrito = carrito.filter(item => item.idProducto.toString() !== idProducto.toString());
        // Actualizar el carrito en el localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        // Volver a cargar los detalles del carrito
        readDetail();
    }
}


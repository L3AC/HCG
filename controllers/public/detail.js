
// Constantes para completar la ruta de la API.
const PRODUCTO_API = 'services/public/1productos.php',
    PEDIDO_API = 'services/public/pedido.php',
    MODELOTALLAS_API = 'services/public/2detalleproductos.php',
    COMENTARIOS_API = 'services/public/comentario.php';
// Constante tipo objeto para obtener los parámetros disponibles en la URL.
const PARAMS = new URLSearchParams(location.search);
// Constante para establecer el formulario de agregar un producto al carrito de compras.
const TALLAS = document.getElementById('selectedItemsListU'),
    ID_MODELO = document.getElementById('idProducto'),
    CANTIDAD_PRODUCTO = document.getElementById('cantidadProducto'),
    IMAGEN_MODELO = document.getElementById('imagenProducto'),
    TIPO_PRODUCTO = document.getElementById('tipoProducto'),
    PRECIO_PRODUCTO = document.getElementById('precioProducto'),
    STOCK_MODELO = document.getElementById('stockModelo'),
    NOMBRE_MODELO = document.getElementById('nombreModelo');

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    btn_comENTARIO = document.getElementById('btn_comentario'),
    ID_MODELO_TALLA = document.getElementById('idModeloTalla'),
    CANTIDAD = document.getElementById('cantidadModelo'),
    STOCK_INFO = document.getElementById('stock'),
    mensajeDiv = document.getElementById('mensajeDiv'),
    IDGUARDAR = document.getElementById('idGuardar');

const SAVE_MODAL2 = new bootstrap.Modal('#saveModal2'),
    MODAL_TITLE2 = document.getElementById('modalTitle2');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM2 = document.getElementById('saveForm2'),
    ADDCOMENTARIO = document.getElementById('addComentario'),
    LISTCOMENTARIO = document.getElementById('listComentario');

// Método del eventos para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.

    // Constante tipo objeto con los datos del producto seleccionado.
    const FORM = new FormData();
    console.log(PARAMS.get('id'));
    FORM.append('idProducto', PARAMS.get('id'));
    // Petición para solicitar los datos del producto seleccionado.
    const DATA = await fetchData(PRODUCTO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        const ROW = DATA.dataset;
        // Se colocan los datos en la página web de acuerdo con el producto seleccionado previamente.
        MAIN_TITLE.textContent = ROW.descripcion_producto;
        IMAGEN_MODELO.src = ROW.imagen_producto;
        ID_MODELO.value = ROW.id_producto;
        TIPO_PRODUCTO.textContent = "Tipo: " + ROW.tipo_producto;
        PRECIO_PRODUCTO.textContent = "Precio: " + ROW.precio_producto;

        const agregarAlPedidoBtn = document.querySelector('#idGuardar button');
        agregarAlPedidoBtn.addEventListener('click', () => {
            const idProducto = ROW.id_producto;
            const cantidad = document.getElementById('cantidadProducto').value;

            // Validar que la cantidad no esté vacía y sea mayor que cero
            if (cantidad.trim() === '' || parseInt(cantidad) <= 0) {
                alert('Por favor ingrese una cantidad válida.');
                return;
            }

            // Obtener el carrito actual o crear uno vacío si no existe
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            // Buscar si el producto ya está en el carrito
            const index = carrito.findIndex(item => item.idProducto === idProducto);
            if (index !== -1) {
                // Si el producto ya está en el carrito, sumar la cantidad
                carrito[index].cantidad = parseInt(carrito[index].cantidad) + parseInt(cantidad);
            } else {
                // Si el producto no está en el carrito, agregarlo con la nueva cantidad
                carrito.push({ idProducto, cantidad });
            }
            // Guardar el carrito en localStorage
            localStorage.setItem('carrito', JSON.stringify(carrito));

            alert('Producto agregado al pedido');
            // Limpiar el campo de cantidad
            document.getElementById('cantidadProducto').value = '';
        });


        const FORM2 = new FormData();
        FORM2.append('idProducto', ID_MODELO.value);
        const DATA2 = await fetchData(MODELOTALLAS_API, 'readByProducto', FORM2);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA2.status) {
            // Se inicializa el contenedor de productos.
            TALLAS.innerHTML = '';
            // Se recorre el conjunto de registros fila por fila a través del objeto row.
            DATA2.dataset.forEach(row => {
                // Se crean y concatenan las tarjetas con los datos de cada producto.
                TALLAS.innerHTML += `
                <td>${row.descripcion_item}</td>
                <td>${row.descripcion_tipo_item}</td>
                <td>${row.cantidad_item}</td>
                `;
            });
        } else {
            // Se presenta un mensaje de error cuando no existen datos para mostrar.
            MAIN_TITLE.textContent = DATA.error;
        }

    } else {
        // Se presenta un mensaje de error cuando no existen datos para mostrar.
        document.getElementById('mainTitle').textContent = DATA.error;
        // Se limpia el contenido cuando no hay datos para mostrar.
        document.getElementById('detalle').innerHTML = '';
    }
});
/*CANTIDAD.addEventListener('input', async function () {
    const FORM = new FormData();
    FORM.append('idModeloTalla', ID_MODELO_TALLA.value);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(MODELOTALLAS_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status === 1) {
        const ROW = DATA.dataset;
        if (CANTIDAD.value > ROW.stock_modelo_talla) {
            mensajeDiv.textContent = 'No puede escoger mas del stock';
            mensajeDiv.style.display = 'block';
            IDGUARDAR.disabled = true;
        }
        else if (CANTIDAD.value <= 0 || CANTIDAD.value > 3) {
            mensajeDiv.textContent = 'Solo puede escoger 3 existencias a la vez';
            mensajeDiv.style.display = 'block';
            IDGUARDAR.disabled = true;
        }
        else {
            mensajeDiv.textContent = "";
            IDGUARDAR.disabled = false;
        }
    }
});*/
/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openModal = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idModeloTalla', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(MODELOTALLAS_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Agregar al carrito';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_MODELO_TALLA.value = ROW.id_modelo_talla;
        STOCK_INFO.textContent = 'Existencias disponibles ' + ROW.stock_modelo_talla;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}


// Método del evento para cuando se envía el formulario de agregar un producto al carrito.
/*SAVE_FORM.addEventListener('submit', async (event) => {

    /*
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(PEDIDO_API, 'createDetail', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se constata si el cliente ha iniciado sesión.
    if (DATA.status) {
        sweetAlert(1, DATA.message, false, 'cart.html');
    } else if (DATA.session) {
        sweetAlert(2, DATA.error, false);
    } else {
        sweetAlert(3, DATA.error, true, 'login.html');
    }
});*/
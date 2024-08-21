<?php

// Se incluye la clase del modelo.
require_once('../../models/data/productos_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $producto = new ProductoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idUsuario'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar filas que coincidan con un valor de búsqueda.
            case 'searchRows':
                if (!$producto->setSearch($_POST['valor'])) {
                    $result['error'] = $producto->getDataError();
                } elseif ($result['dataset'] = $producto->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;

                // Crear un nuevo registro de producto.
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$producto->setTipoProducto($_POST['tipoProducto']) or
                    !$producto->setNombre($_POST['nombreProducto']) or
                    !$producto->setHorario($_POST['horarioProducto']) or
                    !$producto->setPrecio($_POST['precioProducto']) or
                    !$producto->setURL($_POST['imagenProducto']) or
                    !$producto->setEstado(isset($_POST['estadoProducto']) ? 1 : 0) or
                    !$producto->setLunes(isset($_POST['lunesER']) ? 1 : 0) or
                    !$producto->setMartes(isset($_POST['martesER']) ? 1 : 0) or
                    !$producto->setMiercoles(isset($_POST['miercolesER']) ? 1 : 0) or
                    !$producto->setJueves(isset($_POST['juevesER']) ? 1 : 0) or
                    !$producto->setViernes(isset($_POST['viernesER']) ? 1 : 0) or
                    !$producto->setSabado(isset($_POST['sabadoER']) ? 1 : 0) or
                    !$producto->setDomingo(isset($_POST['domingoER']) ? 1 : 0)
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el producto';
                }
                break;

                // Leer todos los registros de productos.
            case 'readAll':
                if ($result['dataset'] = $producto->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No se encontraron registros';
                }
                break;

                // Leer todos los cuantos pedidos por productos.
            case 'readPedidosProducto':
                if ($result['dataset'] = $producto->readPedidosProducto()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No se encontraron registros';
                }
                break;

                // Leer un registro específico de producto.
            case 'readOne':
                if (!$producto->setId($_POST['idProducto'])) {
                    $result['error'] = $producto->getDataError();
                } elseif ($result['dataset'] = $producto->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Producto inexistente';
                }
                break;

                // Actualizar un registro de producto.
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$producto->setId($_POST['idProductoU']) or
                    !$producto->setTipoProducto($_POST['tipoProductoU']) or
                    !$producto->setNombre($_POST['nombreProductoU']) or
                    !$producto->setHorario($_POST['horarioProductoU']) or
                    !$producto->setPrecio($_POST['precioProductoU']) or
                    !$producto->setURL($_POST['imagenProductoU']) or
                    !$producto->setEstado(isset($_POST['estadoProductoU']) ? 1 : 0) or
                    !$producto->setLunes(isset($_POST['lunesEU']) ? 1 : 0) or
                    !$producto->setMartes(isset($_POST['martesEU']) ? 1 : 0) or
                    !$producto->setMiercoles(isset($_POST['miercolesEU']) ? 1 : 0) or
                    !$producto->setJueves(isset($_POST['juevesEU']) ? 1 : 0) or
                    !$producto->setViernes(isset($_POST['viernesEU']) ? 1 : 0) or
                    !$producto->setSabado(isset($_POST['sabadoEU']) ? 1 : 0) or
                    !$producto->setDomingo(isset($_POST['domingoEU']) ? 1 : 0)
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el producto';
                }
                break;

                // Eliminar un registro de producto.
            case 'deleteRow':
                if (!$producto->setId($_POST['idProducto'])) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el producto';
                }
                break;

                // Obtener la cantidad de productos por categoría.
            case 'cantidadProductosCategoria':
                if ($result['dataset'] = $producto->cantidadProductosCategoria()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;

                // Obtener el porcentaje de productos por categoría.
            case 'porcentajeProductosCategoria':
                if ($result['dataset'] = $producto->porcentajeProductosCategoria()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
                // Obtener el top clientes con más compras.
            case 'topClientesCompras':
                if ($result['dataset'] = $producto->topClientesCompras()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
                //Obtener los productos segun el dia para la pantalla de menu
            case 'menuProductos':
                if ($result['dataset'] = $producto->menuProductos()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Productos Inexistentes';
                }
                break;

                // Acción no disponible dentro de la sesión.
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
